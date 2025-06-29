/* ── модуль управления категориями ───────────────────────── */

const CATS = (() => {
  const $ = sel => document.querySelector(sel);
  let editId = null;          // какую категорию сейчас редактируем

  /* --- загрузить список --- */
  async function load() {
    const list = await fetch('/api/categories').then(r=>r.json());
    $('#catBody').innerHTML = list.map(c =>
      `<tr>
         <td>${c.categoryid}</td>
         <td>${c.name}</td>
         <td>
           <button data-edit="${c.categoryid}" data-name="${c.name}">✎</button>
           <button data-del="${c.categoryid}">✕</button>
         </td>
       </tr>`).join('');
  }

  /* --- submit формы (добавление или редактирование) --- */
  async function submit(e) {
    e.preventDefault();
    const name = $('#catName').value.trim();
    if (!name) return alert('Введите название');

    const opts = {
      method: editId ? 'PUT' : 'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name })
    };
    const url = editId ? `/api/categories/${editId}` : '/api/categories';

    const res = await fetch(url, opts);
    if (!res.ok) {
      const j = await res.json();
      alert(j.error || 'Ошибка');
    } else {
      editId = null;
      $('#catForm').reset();
      load();
    }
  }

  /* --- обработка кликов по таблице --- */
  async function onTableClick(e) {
    const idDel  = e.target.dataset.del;
    const idEdit = e.target.dataset.edit;

    if (idDel) {                       // удаление
      if (!confirm('Удалить категорию?')) return;
      const r = await fetch(`/api/categories/${idDel}`, { method:'DELETE' });
      if (!r.ok) {
        const j = await r.json();
        alert(j.error || 'Не удалось удалить');
      }
      load();
    }

    if (idEdit) {                      // редактирование
      editId = idEdit;
      $('#catName').value = e.target.dataset.name;
      $('#catName').focus();
    }
  }

  /* --- init --- */
  function init() {
    load();
    $('#catForm').addEventListener('submit', submit);
    $('#catBody').addEventListener('click', onTableClick);
  }

  return { init };
})();
