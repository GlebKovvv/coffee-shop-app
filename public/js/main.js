/* ==============================================================
   0. Проверка cookie-токена + старт SPA
   ============================================================== */
(async () => {
  /* пробуем получить данные о пользователе по cookie */
  const meResp = await fetch('/api/auth/me');
  if (!meResp.ok) {            // 401 → токен отсутствует или протух
    return location.href = '/login.html';
  }

  const me = await meResp.json();   // { userid, role, name }

  /* полоска с именем в правом верхнем углу */
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div id="userBar">👤 ${me.name} (${me.role})
    <button id="btnLogout" title="Выйти">⎋</button>
    </div>`
  );
document.getElementById('btnLogout').onclick = async () => {
  await fetch('/api/auth/logout', { method:'POST' });  // сервер очистит cookie
  location.href = '/login.html';
};

  /* прячем кнопки меню, недоступные кассиру */
  if (me.role !== 'admin') {
    const allowed = ['pos', 'queue', 'stock', 'reports'];
    document.querySelectorAll('.menu button').forEach(btn => {
      if (!allowed.includes(btn.dataset.page)) btn.style.display = 'none';
    });
  }

  /* запустим главный роутер с домашней заглушкой */
  load('home');
})();

/* ==============================================================
   1. Роутер главного меню
   ============================================================== */
const content     = document.getElementById('content');
const menuButtons = document.querySelectorAll('.menu button');

menuButtons.forEach(btn =>
  btn.addEventListener('click', () => load(btn.dataset.page, btn))
);

function load(page, clickedBtn) {
  /* подсветка активной вкладки */
  menuButtons.forEach(b => b.classList.remove('active'));
  (clickedBtn || document.querySelector(`[data-page="${page}"]`))
    ?.classList.add('active');

  switch (page) {

    /* ---------- Домашняя заглушка ---------- */
    case 'home':
      content.innerHTML = '<p>Выберите раздел в левом меню.</p>';
      break;

    /* ---------- POS ---------- */
    case 'pos':
      renderPOS();
      window.POS.init();
      break;

    /* ---------- Очередь заказов ---------- */
    case 'queue':
      content.innerHTML = `
        <h2>Очередь заказов</h2>
        <table id="queueTable">
          <thead><tr>
            <th>№</th><th>Время</th><th>Позиции</th>
            <th>Сумма</th><th>Статус</th><th></th>
          </tr></thead>
          <tbody id="queueBody"></tbody>
        </table>
        <p class="hint">строки старше&nbsp;5&nbsp;минут подсвечиваются красным</p>`;
      window.QUEUE.init();
      break;

    /* ---------- категории ---------- */
    case 'categories':
      content.innerHTML = `
        <h2>Категории</h2>
        <form id="catForm">
          <input id="catName" placeholder="Название">
          <button>Сохранить</button>
        </form>
        <table id="catTable">
          <thead><tr><th>ID</th><th>Название</th><th></th></tr></thead>
          <tbody id="catBody"></tbody>
        </table>`;
      CATS.init();
      break;

    /* ---------- товары ---------- */
    case 'items':
      content.innerHTML = `
        <h2>Товары</h2>
        <form id="prodForm">
          <input id="prodName" placeholder="Название">
          <select id="prodCat"></select>
          <input id="prodPrice" type="number" step="0.01" placeholder="Цена">
          <label><input type="checkbox" id="prodActive" checked> Активен</label>
          <button>Сохранить</button>
        </form>
        <table id="prodTable">
          <thead><tr><th>ID</th><th>Название</th><th>Категория</th><th>Цена</th><th></th></tr></thead>
          <tbody id="prodBody"></tbody>
        </table>`;
      PRODUCTS.init();
      break;

    /* ---------- добавки ---------- */
    case 'extras':
      content.innerHTML = `
        <h2>Добавки</h2>
        <form id="extraForm">
          <input id="extraName" placeholder="Название">
          <input id="extraPrice" type="number" step="0.01" placeholder="Цена">
          <button>Сохранить</button>
        </form>
        <table id="extraTable">
          <thead><tr><th>ID</th><th>Название</th><th>Цена</th><th></th></tr></thead>
          <tbody id="extraBody"></tbody>
        </table>`;
      EXTRAS.init();
      break;


    /* =====  СКЛАД  =========================================== */
    case 'stock':
      content.innerHTML = `
        <h2>Склад</h2>
        <form id="invForm">
          <input  id="invName" placeholder="Название">
          <input  id="invQty"  type="number" step="0.01" placeholder="Кол-во">
          <select id="invUnit"></select>          <!-- селект вместо input -->
          <input  id="invMin"  type="number" step="0.01" placeholder="Мин. остаток">
          <button>Сохранить</button>
        </form>
        <table id="invTable">
          <thead><tr>
            <th>ID</th><th>Название</th><th>Кол-во</th><th>Ед.</th><th>Мин.</th><th></th>
          </tr></thead>
          <tbody id="invBody"></tbody>
        </table>
        <p class="hint warn">красный&nbsp;— ниже минимального остатка</p>`;
      INV.init();
      break;

    /* =====  ПОСТАВЩИКИ  ======================================= */
    case 'suppliers':
      content.innerHTML = `
        <h2>Поставщики</h2>
        <form id="supForm">
          <input id="supName"  placeholder="Название">
          <input id="supPhone" placeholder="Телефон">
          <button>Сохранить</button>
        </form>
        <table id="supTable">
          <thead><tr><th>ID</th><th>Название</th><th>Телефон</th><th></th></tr></thead>
          <tbody id="supBody"></tbody>
        </table>`;
      SUPPLIERS.init();
      break;

    /* =====  СОТРУДНИКИ  ====================================== */
    case 'staff':
      content.innerHTML = `
        <h2>Сотрудники</h2>
        <form id="stForm">
          <input id="stName"  placeholder="ФИО">
          <select id="stPos"></select>
          <input id="stPhone" placeholder="Телефон">
          <input id="stMail"  placeholder="Email">
          <button>Сохранить</button>
        </form>
        <table id="stTable">
          <thead><tr>
            <th>ID</th><th>ФИО</th><th>Должность</th>
            <th>Телефон</th><th>Email</th><th></th>
          </tr></thead>
          <tbody id="stBody"></tbody>
        </table>`;
      STAFF.init();
      break;

    /* =====  КЛИЕНТЫ  ========================================= */
    case 'customers':
      content.innerHTML = `
        <h2>Клиенты и лояльность</h2>
        <form id="custForm">
          <input id="custName"  placeholder="Имя">
          <input id="custPhone" placeholder="Телефон">
          <input id="custMail"  placeholder="Email">
          <button>Сохранить</button>
        </form>
        <table id="custTable">
          <thead><tr>
            <th>ID</th><th>Имя</th><th>Телефон</th><th>Баллы</th><th></th>
          </tr></thead>
          <tbody id="custBody"></tbody>
        </table>`;
      CUSTOMERS.init();
      break;

    /* =====  ОТЧЁТЫ  ========================================== */
    case 'reports':
      content.innerHTML = `
        <h2>Отчёты</h2>
        <div class="rep-bar">
          <select id="repType">
            <option value="sales">Продажи (выручка)</option>
            <option value="top">Топ-товары</option>
            <option value="stock">Низкие остатки</option>
            <option value="staff">Эффективность сотрудников</option>
          </select>
          с <input type="date" id="repFrom"> по <input type="date" id="repTo">
          <button id="repRun">Сформировать</button>
          <button id="btnCsv">⬇︎ CSV</button>
        </div>
        <canvas id="repChart" style="max-height:260px"></canvas>
        <div id="repOut"></div>`;
      REPORT.init();
      break;

    /* =====  fallback  ======================================== */
    default:
      content.innerHTML = '<p>Неизвестный раздел.</p>';
  }
}

/* ---------- шаблон POS ---------- */
function renderPOS() {
  content.innerHTML = `
    <h2>POS (Продажа)</h2>
    <div class="client">
      <input id="phone" placeholder="Телефон клиента">
      <button id="btnPhone">OK</button>
    </div>

    <div id="pos-wrapper">
      <aside id="cartPane">
        <h3>Корзина</h3>
        <ul id="cartList"></ul>
        <div class="totals">
          <div>Итого: <span id="totalSum">0.00 ₽</span></div>
          <div id="discountLine"></div>
          <div>Оплачено: <span id="paidSum">0.00 ₽</span></div>
          <div>Сдача: <span id="changeSum">0.00 ₽</span></div>
        </div>
      </aside>

      <main id="gridPane"><div id="grid"></div></main>

      <section id="payPane">
        <input id="calcDisplay" value="0" readonly>
        <div id="keypad">
          ${[7,8,9,4,5,6,1,2,3,0,'.','C']
            .map(k => `<button data-key="${k}">${k}</button>`).join('')}
        </div>
        <select id="payType">
          <option value="cash">Наличные</option>
          <option value="card">Карта</option>
        </select>
      </section>
    </div>

    <div id="pos-actions">
      <button id="btnClear">Очистить</button>
      <button id="btnRemove">Удалить позицию</button>
      <button id="btnPay">Оплатить</button>
      <button id="btnBack">Назад</button>
    </div>`;
}

/* стартовая вкладка */
