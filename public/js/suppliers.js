/* public/js/suppliers.js
   CRUD-модуль для экрана «Поставщики» */

const SUPPLIERS = (() => {
  const $ = sel => document.querySelector(sel);
  let editId = null;

  // 1) Загрузить список поставщиков и отрисовать таблицу
  async function load() {
    const list = await fetch('/api/suppliers').then(r => r.json());
    $('#supBody').innerHTML = list.map(s => `
      <tr>
        <td>${s.supplierid}</td>
        <td>${s.suppliername}</td>
        <td>${s.phone || ''}</td>
        <td>
          <button data-edit="${s.supplierid}" data-name="${s.suppliername}" data-phone="${s.phone || ''}">✎</button>
          <button data-del="${s.supplierid}">✕</button>
        </td>
      </tr>`).join('');
  }

  // 2) Обработка формы добавления/редактирования
  async function submit(e) {
    e.preventDefault();
    const body = {
      suppliername: $('#supName').value.trim(),
      phone:        $('#supPhone').value.trim()
    };
    if (!body.suppliername) return alert('Введите название поставщика');

    const opts = {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };
    const url = editId
      ? `/api/suppliers/${editId}`
      : '/api/suppliers';

    const res = await fetch(url, opts);
    if (!res.ok) {
      const j = await res.json();
      return alert(j.error || 'Ошибка при сохранении');
    }
    editId = null;
    $('#supForm').reset();
    load();
  }

  // 3) Клики по таблице (редактировать / удалить)
  async function onTableClick(e) {
    const delId = e.target.dataset.del;
    const edtId = e.target.dataset.edit;

    if (delId) {
      if (!confirm('Удалить поставщика?')) return;
      await fetch(`/api/suppliers/${delId}`, { method: 'DELETE' });
      load();
    }

    if (edtId) {
      editId = edtId;
      $('#supName').value  = e.target.dataset.name;
      $('#supPhone').value = e.target.dataset.phone;
    }
  }

  // 4) Инициализация модуля
  function init() {
    load();
    $('#supForm').addEventListener('submit', submit);
    $('#supBody').addEventListener('click', onTableClick);
  }

  return { init };
})();
