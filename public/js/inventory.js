/* ──────────────────────────────────────────────────────────
   public/js/inventory.js  —  управление складом
   ────────────────────────────────────────────────────────── */
const INV = (() => {

  const $ = (s, p = document) => p.querySelector(s);
  let editId = null;
  const unitMap = new Map();     // unitid → unitname

  /* ---------- единицы измерения ---------- */
  async function loadUnits() {
    const sel = $('#invUnit');
    if (sel.options.length) return;              // уже загружены

    const u = await fetch('/api/units').then(r => r.json());
    sel.innerHTML = u.map(x => {
      unitMap.set(x.unitid, x.unitname);
      return `<option value="${x.unitid}">${x.unitname}</option>`;
    }).join('');
  }

  /* ---------- строка таблицы ---------- */
  function row(r) {
    return `<tr data-id="${r.ingredientid}" data-unit="${r.unitid}">
      <td>${r.ingredientid}</td>
      <td>${r.name}</td>
      <td>${(+r.quantity).toFixed(2)}</td>
      <td>${unitMap.get(r.unitid) || r.unit.unitname}</td>
      <td>${(+r.reorderlevel).toFixed(2)}</td>
      <td>
        <button data-act="add">+Δ</button>
        <button data-act="sub">−Δ</button>
        <button data-act="edit">✎</button>
        <button data-act="del">✕</button>
      </td>
    </tr>`;
  }

  /* ---------- загрузка списка ---------- */
  async function load() {
    await loadUnits();                                // сначала селект
    const list = await fetch('/api/inventory').then(r => r.json());
    $('#invBody').innerHTML = list.map(row).join('');
  }

  /* ---------- submit (создать / сохранить) ---------- */
  async function submit(e) {
    e.preventDefault();
    const body = {
      name         : $('#invName').value.trim(),
      quantity     : +$('#invQty').value  || 0,
      unitid       : +$('#invUnit').value,
      reorderlevel : +$('#invMin').value || 0
    };
    if (!body.name) return alert('Название?');

    const opt = {
      method : editId ? 'PATCH' : 'POST',
      headers: { 'Content-Type':'application/json' },
      body   : JSON.stringify(body)
    };
    const url = editId ? `/api/inventory/${editId}` : '/api/inventory';
    const r   = await fetch(url, opt);
    if (!r.ok) alert('Ошибка');

    editId = null;
    e.target.reset();
    load();
  }

  /* ---------- изменение остатка (±Δ) ---------- */
  async function change(id, sign) {
    const d = prompt('Сколько прибавить / вычесть?');
    if (!d) return;
    const delta = +d;
    if (isNaN(delta) || delta <= 0) return alert('Введите положительное число');

    const r = await fetch(`/api/inventory/${id}/${sign}`, {
      method : 'PATCH',
      headers: { 'Content-Type':'application/json' },
      body   : JSON.stringify({ delta })
    });
    if (!r.ok) alert('Ошибка');
    load();
  }

  /* ---------- действия в таблице ---------- */
  async function onTable(e) {
    const tr  = e.target.closest('tr');
    const id  = tr?.dataset.id;
    const act = e.target.dataset.act;
    if (!id || !act) return;

    if (act === 'add')   return change(id, 'add');
    if (act === 'sub')   return change(id, 'remove');

    if (act === 'edit') {
      editId = id;
      $('#invName').value  = tr.children[1].textContent;
      $('#invQty').value   = parseFloat(tr.children[2].textContent);
      $('#invUnit').value  = tr.dataset.unit;
      $('#invMin').value   = parseFloat(tr.children[4].textContent);
      return;
    }

    if (act === 'del') {
      if (!confirm('Удалить позицию склада?')) return;
      const r = await fetch(`/api/inventory/${id}`, { method:'DELETE' });
      if (!r.ok) alert('Ошибка');
      load();
    }
  }

  /* ---------- публичный init ---------- */
  function init() {
    load();
    $('#invForm').addEventListener('submit', submit);
    $('#invBody').addEventListener('click', onTable);
  }

  return { init };
})();
