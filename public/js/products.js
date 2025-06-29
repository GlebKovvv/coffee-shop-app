/* ── модуль управление товарами ─────────────────────────── */

const PRODUCTS = (() => {
  const $ = s => document.querySelector(s);
  let categories = [], editId=null;

  /* загрузка категорий + списка товаров */
  async function loadAll() {
    categories = await fetch('/api/categories').then(r=>r.json());
    renderCategorySelect();
    loadItems();
  }
  async function loadItems() {
    const list = await fetch('/api/items').then(r=>r.json());
    $('#prodBody').innerHTML = list.map(i=>`
      <tr>
        <td>${i.menuitemid}</td>
        <td>${i.name}</td>
        <td>${i.menucategory?.name||'-'}</td>
        <td>${i.price}</td>
        <td>
          <button data-edit="${i.menuitemid}">✎</button>
          <button data-del="${i.menuitemid}">✕</button>
        </td>
      </tr>`).join('');
  }

  /* заполнить <select> категориями */
  function renderCategorySelect() {
    $('#prodCat').innerHTML = categories
      .map(c=>`<option value="${c.categoryid}">${c.name}</option>`).join('');
  }

  /* submit (create / update) */
  async function submit(e) {
    e.preventDefault();
    const body = {
      name: $('#prodName').value.trim(),
      categoryid: $('#prodCat').value,
      price: +$('#prodPrice').value || 0,
      active: $('#prodActive').checked
    };
    if (!body.name) return alert('Введите название');

    const opts = { method: editId?'PUT':'POST',
                   headers:{'Content-Type':'application/json'},
                   body: JSON.stringify(body) };
    const url = editId? `/api/items/${editId}` : '/api/items';

    const r = await fetch(url, opts);
    if (!r.ok) { alert((await r.json()).error||'Ошибка'); return; }

    editId=null; $('#prodForm').reset(); loadItems();
  }

  /* обработка таблицы */
  async function onTableClick(e) {
    const del = e.target.dataset.del;
    const edt = e.target.dataset.edit;

    if (del) {
      if (!confirm('Удалить товар?')) return;
      const r = await fetch(`/api/items/${del}`, { method:'DELETE' });
      if (!r.ok) alert((await r.json()).error||'Ошибка удаления');
      loadItems();
    }
    if (edt) {
      const row = e.target.closest('tr').children;
      editId = edt;
      $('#prodName').value  = row[1].textContent;
      $('#prodCat').value   = categories.find(c=>c.name===row[2].textContent)?.categoryid||'';
      $('#prodPrice').value = row[3].textContent;
      $('#prodActive').checked = true;
    }
  }

  function init() {
    loadAll();
    $('#prodForm').addEventListener('submit', submit);
    $('#prodBody').addEventListener('click', onTableClick);
  }
  return { init };
})();
