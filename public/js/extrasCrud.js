/* модуль “Добавки”  */
const EXTRAS = (() => {

  const $ = s => document.querySelector(s);
  let editId = null;

  async function load() {
    const list = await fetch('/api/extras').then(r => r.json());
    $('#extraBody').innerHTML = list.map(e => `
      <tr>
        <td>${e.extraid}</td>
        <td>${e.extraname}</td>
        <td>${(+e.extraprice).toFixed(2)}</td>
        <td>
          <button data-edit="${e.extraid}">✎</button>
          <button data-del="${e.extraid}">✕</button>
        </td>
      </tr>`).join('');
  }

  async function submit(e) {
    e.preventDefault();

    const body = {
      extraname : $('#extraName').value.trim(),
      extraprice: +$('#extraPrice').value || 0
    };
    if (!body.extraname) return alert('Введите название');

    const opt = {
      method : editId ? 'PUT' : 'POST',
      headers: { 'Content-Type':'application/json' },
      body   : JSON.stringify(body)
    };
    const url = editId ? `/api/extras/${editId}` : '/api/extras';

    const r = await fetch(url, opt);
    if (!r.ok) alert('Ошибка');

    editId = null;
    $('#extraForm').reset();
    load();
  }

  async function onTable(e) {
    const del = e.target.dataset.del;
    const edt = e.target.dataset.edit;

    if (del) {
      if (!confirm('Удалить?')) return;
      const r = await fetch(`/api/extras/${del}`, { method:'DELETE' });
      if (!r.ok) alert('Ошибка');
      load();
    }

    if (edt) {
      const row = e.target.closest('tr').children;
      editId = edt;
      $('#extraName').value  = row[1].textContent;
      $('#extraPrice').value = row[2].textContent;
    }
  }

  function init() {
    load();
    $('#extraForm').addEventListener('submit', submit);
    $('#extraBody').addEventListener('click', onTable);
  }

  return { init };
})();
