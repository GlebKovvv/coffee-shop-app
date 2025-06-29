/* ─────────────────────────────────────────────────────────────
   customers.js   |  Клиенты и программа лояльности
   ───────────────────────────────────────────────────────────── */

(function (global) {

  /* короткие помощники */
  const $ = s => document.querySelector(s);

  /* ==========================================================
     1. РЕНДЕР СТРОКИ ТАБЛИЦЫ
     ========================================================== */
  function row(cust) {
    return `<tr data-id="${cust.customerid}">
      <td>${cust.clientid}</td>
      <td>${cust.name}</td>
      <td>${cust.phone ?? '—'}</td>
      <td class="pts">${cust.loyaltypoints ?? 0}</td>
      <td>
        <button data-act="edit">✎</button>
        <button data-act="del">✕</button>
      </td>
    </tr>`;
  }

  /* ==========================================================
     2. ЗАГРУЗКА СПИСКА КЛИЕНТОВ
     ========================================================== */
  async function load() {
    const r = await fetch('/api/customers');      // cookie уже содержит JWT
    if (!r.ok) { alert('Ошибка загрузки клиентов'); return; }
    const list = await r.json();                  // [{customerid,name,phone,loyaltypoints}, … ]
    $('#custBody').innerHTML = list.map(row).join('');
  }

  /* ==========================================================
     3. СОХРАНЕНИЕ (ДОБАВЛЕНИЕ / РЕДАКТИРОВАНИЕ)
     ========================================================== */
  async function save(e) {
    e.preventDefault();
    const id    = this.dataset.editId;
    const body  = {
      name : $('#custName').value.trim(),
      phone: $('#custPhone').value.trim(),
      email: $('#custMail').value.trim()
    };
    const url   = id ? `/api/customers/${id}` : '/api/customers';
    const method= id ? 'PUT' : 'POST';

    const r = await fetch(url, {
      method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)
    });
    if (!r.ok) { alert('Не удалось сохранить'); return; }

    /* очистим форму и перезагрузим список */
    e.target.reset();
    delete e.target.dataset.editId;
    load();
  }

  /* ==========================================================
     4. ОБРАБОТЧИК КНОПОК ТАБЛИЦЫ
     ========================================================== */
  async function onTable(e) {
    const act = e.target.dataset.act;
    if (!act) return;
    const tr  = e.target.closest('tr');
    const id  = tr.dataset.id;

    if (act === 'del') {
      if (!confirm('Удалить клиента?')) return;
      const r = await fetch(`/api/customers/${id}`, { method:'DELETE' });
      if (r.ok) tr.remove();
      else alert('Не удалось удалить');
    }

    if (act === 'edit') {
      const cells = tr.children;
      $('#custName').value  = cells[1].textContent;
      $('#custPhone').value = cells[2].textContent === '—' ? '' : cells[2].textContent;
      $('#custMail').value  = '';         // email не выводится в таблице
      $('#custForm').dataset.editId = id; // помечаем, что это редактирование
    }
  }

  /* ==========================================================
     5. ПУБЛИЧНЫЙ ИНТЕРФЕЙС МОДУЛЯ
     ========================================================== */
  function init() {
    load();
    $('#custForm').onsubmit = save;
    $('#custBody').onclick  = onTable;
  }

  /* экспорт */
  global.CUSTOMERS = { init };

})(window);
