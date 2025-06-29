/* public/js/staff.js
   CRUD-модуль «Сотрудники» */

const STAFF = (() => {
  const $ = sel => document.querySelector(sel);

  let editId   = null; // какого сотрудника редактируем
  let positions = [];  // справочник должностей

  /* ---------- загрузка должностей ---------- */
  async function loadPositions() {
    positions = await fetch('/api/positions').then(r => r.json());
    $('#stPos').innerHTML = positions
      .map(p => `<option value="${p.positionid}">${p.positionname}</option>`)
      .join('');
  }

  /* ---------- загрузка сотрудников ---------- */
  async function loadStaff() {
    const list = await fetch('/api/staff').then(r => r.json());

    $('#stBody').innerHTML = list.map(s => `
      <tr>
        <td>${s.employeeid || s.staffid}</td>
        <td>${s.name}</td>
        <td>${s.position ? s.position.positionname : ''}</td>
        <td>${s.phone || ''}</td>
        <td>${s.email || ''}</td>
        <td>
          <button data-edit="${s.employeeid || s.staffid}">✎</button>
          <button data-del="${s.employeeid || s.staffid}">✕</button>
        </td>
      </tr>`).join('');
  }

  /* ---------- сохранение (создать / обновить) ---------- */
  async function submit(e) {
    e.preventDefault();

    const body = {
      name:       $('#stName').value.trim(),
      positionid: $('#stPos').value,
      phone:      $('#stPhone').value.trim(),
      email:      $('#stMail').value.trim()
    };
    if (!body.name || !body.positionid) {
      return alert('ФИО и должность обязательны');
    }

    const opts = {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };
    const url = editId ? `/api/staff/${editId}` : '/api/staff';

    const res = await fetch(url, opts);
    if (!res.ok) {
      const j = await res.json();
      alert(j.error || 'Ошибка сохранения');
      return;
    }
    editId = null;
    $('#stForm').reset();
    loadStaff();
  }

  /* ---------- клики по таблице ---------- */
  async function onTableClick(e) {
    const delId = e.target.dataset.del;
    const editIdAttr = e.target.dataset.edit;

    /* удалить */
    if (delId) {
      if (!confirm('Удалить сотрудника?')) return;

      const res = await fetch(`/api/staff/${delId}`, { method: 'DELETE' });
      if (res.ok) {
        loadStaff();
      } else {
        const j = await res.json();
        const msg = j.error === 'has linked records'
          ? 'Нельзя удалить: есть связанные записи (например, заказы).'
          : j.error || 'Ошибка удаления';
        alert(msg);
      }
    }

    /* редактировать */
    if (editIdAttr) {
      editId = editIdAttr;

      const cells = e.target.closest('tr').children;
      $('#stName').value  = cells[1].textContent;
      $('#stPos').value   = positions.find(p => p.positionname === cells[2].textContent)?.positionid || '';
      $('#stPhone').value = cells[3].textContent;
      $('#stMail').value  = cells[4].textContent;
    }
  }

  /* ---------- init ---------- */
  function init() {
    loadPositions().then(loadStaff);
    $('#stForm').addEventListener('submit', submit);
    $('#stBody').addEventListener('click', onTableClick);   // ← исправлено
  }

  return { init };
})();
