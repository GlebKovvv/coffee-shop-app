/* ──────────────────────────────────────────────────────────
   POS-модуль: продажа, корзина, оплата, клиентская скидка
   ────────────────────────────────────────────────────────── */
(function (global) {

  /* ────── состояние ────── */
  let categories = [];       // справочник категорий
  let items      = [];       // товары выбранной категории
  let addons     = [];       // все возможные добавки

  let cart    = [];          // [{ item, extras:[{id,назв,цена}], qty }]
  let curCat  = null;        // id открытой категории
  let modal   = false;       // открыто ли модальное окно
  let client  = null;        // { id, name, phone, discount }

  /* ────── утилиты ────── */
  const $ = s => document.querySelector(s);
  const money = v => `${(+v).toFixed(2)} ₽`;
  const toast = msg => {
    const d = Object.assign(document.createElement('div'),
      { className: 'toast', innerHTML: msg });
    document.body.appendChild(d);
    setTimeout(() => d.classList.add('show'), 10);
    setTimeout(() => { d.classList.remove('show'); setTimeout(() => d.remove(), 300); }, 3000);
  };

/* заменить прежнюю версию checkPhone на эту */
async function checkPhone(){
  const phone=$('#phone').value.trim();
  if(!phone) { toast('Введите телефон'); return; }

  const r = await fetch(`/api/customers?phone=${encodeURIComponent(phone)}`);
  if(r.status===404){                 // бэкенд явно вернул NOT FOUND
    askClientName(phone); return;
  }
  if(r.ok){
    const data = await r.json();
    const c = Array.isArray(data) ? data[0] : data;   // массив или объект
    if(!c || !c.customerid){ askClientName(phone); return; }

    client = { id:c.customerid, name:c.name, phone:c.phone, discount:0.05 };
    toast(`Клиент: ${c.name}. Скидка 5 %`);
    redrawCart(); return;
  }
  toast('Ошибка поиска клиента');
}


  function askClientName(phone) {
    modal = true;
    document.body.insertAdjacentHTML('beforeend', `
      <div id="overlay"></div>
      <div class="modal">
        <h3>Новый клиент</h3>
        <input id="newName" placeholder="Имя"><br><br>
        <button id="okName">OK</button>
        <button id="cnName">Отмена</button>
      </div>`);
    $('#okName').onclick = async () => {
      const name = $('#newName').value.trim();
      if (!name) return toast('Введите имя');
      const r = await fetch('/api/customers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone })
      });
      if (!r.ok) { toast('Ошибка добавления клиента'); closeModal(); return; }
      const c = await r.json();
      client = { id: c.customerid, name: c.name, phone: c.phone, discount: 0 };
      toast('Клиент добавлен');
      closeModal(); redrawCart();
    };
    $('#cnName').onclick = closeModal;
  }
  const closeModal = () => { modal = false; $('#overlay')?.remove(); $('.modal')?.remove(); };

  /* ──────────────────────────────────────────────────────────
     2. ЗАГРУЗКА СПРАВОЧНИКОВ
     ────────────────────────────────────────────────────────── */
  async function loadInitial() {
    [categories, addons] = await Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/extras').then(r => r.json())
    ]);
    renderGrid();                       // показываем категории
    bindUI();                           // подписки на клики
    calcChange();                       // расчёт сдачи (нулевой)
  }

  /* ──────────────────────────────────────────────────────────
     3. GRID: категории / товары
     ────────────────────────────────────────────────────────── */
  function renderGrid(cat = null) {
    curCat = cat;
    const g = $('#grid'); g.innerHTML = '';
    if (!cat) {                        // показываем категории
      g.innerHTML = categories.map(c =>
        `<button class="tile" data-cat="${c.categoryid}">${c.name}</button>`).join('');
      return;
    }
    g.innerHTML = '<button class="tile back" data-back>← Назад</button>';
    fetch(`/api/items?category=${cat}`).then(r => r.json()).then(list => {
      items = list.map(i => ({ ...i, price: +i.price }));
      g.innerHTML += items.map(i =>
        `<button class="tile" data-item="${i.menuitemid}">
           <span>${i.name}</span><br><small>${money(i.price)}</small>
         </button>`).join('');
    });
  }

  /* ──────────────────────────────────────────────────────────
     4. ДОБАВКИ
     ────────────────────────────────────────────────────────── */
  function askAddons(id) {
    const item = items.find(i => i.menuitemid == id); if (!item) return;
    modal = true;
    const list = addons.map(a =>
      `<label><input type="checkbox" value="${a.extraid}" data-p="${a.extraprice}">
        ${a.extraname} (+${money(a.extraprice)})</label>`).join('<br>');
    document.body.insertAdjacentHTML('beforeend', `
      <div id="overlay"></div>
      <div class="modal">
        <h3>${item.name}</h3>${list}<br>
        <button id="addBtn">Добавить</button>
        <button id="cancelBtn">Отмена</button>
      </div>`);
    $('#addBtn').onclick = () => {
      const extras = [...document.querySelectorAll('.modal input:checked')]
        .map(cb => ({
          extraid: +cb.value,
          extraname: cb.parentElement.textContent.trim(),
          extraprice: +cb.dataset.p
        }));
      closeModal(); addToCart(item, extras);
    };
    $('#cancelBtn').onclick = closeModal;
  }

  /* ──────────────────────────────────────────────────────────
     5. КОРЗИНА
     ────────────────────────────────────────────────────────── */
  const eqArr = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

  function addToCart(item, extras) {
    const ids = extras.map(e => e.extraid).sort((a, b) => a - b);
    const found = cart.find(p =>
      p.item.menuitemid === item.menuitemid &&
      eqArr(p.extras.map(e => e.extraid).sort((a, b) => a - b), ids));
    found ? found.qty++ : cart.push({ item, extras, qty: 1 });
    redrawCart();
  }

  function redrawCart() {
    /* список позиций */
    $('#cartList').innerHTML = cart.map((p, i) => {
      const base = p.item.price + p.extras.reduce((s, x) => s + x.extraprice, 0);
      const extras = p.extras.length
        ? '<ul>' + p.extras.map(x => `<li>${x.extraname}</li>`).join('') + '</ul>' : '';
      return `<li data-i="${i}">
        <span>${p.item.name} × ${p.qty}</span> — ${money(base * p.qty)}
        <button class="delBtn">✕</button>${extras}</li>`;
    }).join('');
    document.querySelectorAll('.delBtn').forEach(btn =>
      btn.onclick = () => { cart.splice(btn.parentElement.dataset.i, 1); redrawCart(); });

    /* итог и скидка */
    const total = cart.reduce((s, p) =>
      s + (p.item.price + p.extras.reduce((a, b) => a + b.extraprice, 0)) * p.qty, 0);
    const disc = client ? +(total * client.discount).toFixed(2) : 0;
    $('#discountLine').textContent = disc ? `Скидка: -${money(disc)}` : '';
    $('#totalSum').textContent = money(total - disc);

    syncCard(); calcChange();
  }

  /* ──────────────────────────────────────────────────────────
     6. КАЛЬКУЛЯТОР
     ────────────────────────────────────────────────────────── */
  function keyPress(e) {
    const k = e.target.dataset.key; if (!k) return;
    const d = $('#calcDisplay');
    if (k === 'C') d.value = '0';
    else {
      if (d.value === '0' && k !== '.' && k !== '0') d.value = '';
      d.value += k;
    }
    calcChange();
  }
  function calcChange() {
    const paid = +$('#calcDisplay').value || 0;
    const total = parseFloat($('#totalSum').textContent) || 0;
    $('#paidSum').textContent = money(paid);
    $('#changeSum').textContent = money(Math.max(0, paid - total));
  }
  function syncCard() {
    if ($('#payType').value === 'card')
      $('#calcDisplay').value = $('#totalSum').textContent.replace(' ₽', '');
    calcChange();
  }

  /* ──────────────────────────────────────────────────────────
     7. СЕРВЕР: СОХРАНИТЬ ЗАКАЗ
     ────────────────────────────────────────────────────────── */
  async function saveOrder(discount) {
    const body = {
      items: cart.map(p => ({
        menuitemid: p.item.menuitemid,
        qty: p.qty,
        price: p.item.price + p.extras.reduce((s, x) => s + x.extraprice, 0),
        extras: p.extras.map(x => x.extraid)
      })),
      payType: $('#payType').value,
      staffId: null,
      clientPhone: client?.phone || null,
      clientName: client?.name || null,
      discount
    };
    const r = await fetch('/api/orders', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!r.ok) throw new Error('db');
    return r.json();              // { orderid, number }
  }

  /* ──────────────────────────────────────────────────────────
     8. ПЕЧАТЬ ЧЕКА
     ────────────────────────────────────────────────────────── */
  function printReceipt(num, total) {
    const w = window.open('', '', 'width=280,height=500');
    const rows = cart.map(p => {
      const base = p.item.price + p.extras.reduce((s, x) => s + x.extraprice, 0);
      const extras = p.extras.map(x => '&nbsp;&nbsp;+ ' + x.extraname).join('<br>');
      return `<tr><td>${p.item.name} ×${p.qty}</td>
              <td style="text-align:right">${money(base * p.qty)}</td></tr>
              ${extras ? `<tr><td colspan="2">${extras}</td></tr>` : ''}`;
    }).join('');
    const now = new Date().toLocaleString('ru-RU');
    w.document.write(`<style>@page{size:58mm auto;margin:0}
      body{font:11px monospace;margin:0;padding:4px}table{width:100%}</style>
      <center><b>Café POS</b><br>${now}<br>Заказ №${num}</center><hr>
      <table>${rows}</table><hr>
      <p>Итого: ${money(total)}</p>
      <p>${$('#payType').value === 'card' ? 'Карта' : 'Наличные'}</p><hr>
      <center>Спасибо!</center>`);
    w.print(); setTimeout(() => w.close(), 100);
  }

  /* ──────────────────────────────────────────────────────────
     9. КНОПКИ ДЕЙСТВИЙ
     ────────────────────────────────────────────────────────── */
  async function onAction(e) {
    const id = e.target.id;

    if (id === 'btnClear') { cart = []; redrawCart(); $('#calcDisplay').value = '0'; calcChange(); }
    if (id === 'btnRemove') { cart.pop(); redrawCart(); }
    if (id === 'btnBack')   window.load('home');

    if (id === 'btnPay') {
      if (!cart.length) return toast('Корзина пуста');
      const total = parseFloat($('#totalSum').textContent) || 0;
      const paid  = +$('#calcDisplay').value || 0;
      if (paid < total) return toast('Недостаточно средств');

      const discount = parseFloat($('#discountLine').textContent.replace(/[^\d.]/g, '') || 0);

      try {
        const o = await saveOrder(discount);
        if (confirm('Распечатать чек?')) printReceipt(o.number, total);
        toast(`Заказ №${o.number} сохранён`);
        cart = []; client = null; $('#phone').value = '';
        $('#discountLine').textContent = ''; $('#calcDisplay').value = '0';
        redrawCart();
      } catch { toast('Ошибка сохранения заказа'); }
    }
  }

  /* ──────────────────────────────────────────────────────────
     10. ПОДПИСКИ И СТАРТ
     ────────────────────────────────────────────────────────── */
  function bindUI() {
    /* выбор категорий / товаров */
    $('#grid').addEventListener('click', e => {
      if (modal) return;
      const cat = e.target.closest('[data-cat]')?.dataset.cat;
      if (cat) return renderGrid(+cat);
      if (e.target.closest('[data-back]')) return renderGrid();
      const itm = e.target.closest('[data-item]')?.dataset.item;
      if (!itm) return;
      if (curCat === 1 || curCat === 2) askAddons(+itm);
      else addToCart(items.find(i => i.menuitemid == itm), []);
    });

    $('#keypad').addEventListener('click', keyPress);
    $('#pos-actions').addEventListener('click', onAction);
    $('#btnPhone').addEventListener('click', checkPhone);
    $('#payType').addEventListener('change', syncCard);
  }

  /* экспортируем init */
  global.POS = { init: loadInitial };

})(window);