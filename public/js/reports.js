/* public/js/reports.js
   Экран «Отчёты» — 4 вида отчётов + график (Chart.js) + CSV-экспорт */

const REPORT = (() => {
  /* ── короткие утилиты ───────────────────────────────────────── */
  const $ = s => document.querySelector(s);

  /* безопасно получаем JSON: если сервер вернул HTML/500, ловим */
  async function getJSON(url) {
    const res = await fetch(url);
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt);
    }
    return res.json();
  }

  /* CSV-скачивание */
  function downloadCSV(rows, filename) {
    if (!rows || !rows.length) return;
    const csv = [
      Object.keys(rows[0]).join(','),
      ...rows.map(r => Object.values(r).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* генерация HTML-таблицы */
  function makeTable(rows) {
    if (!rows.length) return '<p>Нет данных</p>';
    return `<table class="rep">
      <thead><tr>${Object.keys(rows[0]).map(h => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(r => `<tr>${Object.values(r).map(v => `<td>${v}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>`;
  }

  /* ── работа с Chart.js ─────────────────────────────────────── */
  let chart;                                           // текущий график
  function drawChart(labels, data, title) {
    if (chart) chart.destroy();
    const ctx = $('#repChart').getContext('2d');
    chart = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ label: title, data }] },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales:  { y: { beginAtZero: true } }
      }
    });
  }

  /* ── основной запуск отчёта ────────────────────────────────── */
  async function run() {
    const type = $('#repType').value;
    const from = $('#repFrom').value;
    const to   = $('#repTo').value;

    /* для CSV */
    let csvRows = [];

    try {
      switch (type) {
        /* 1) Продажи */
        case 'sales': {
          const r = await getJSON(`/api/reports/sales?from=${from}&to=${to}`);
          $('#repOut').innerHTML =
            `<p>Заказов: <b>${r.totals.orders}</b>,
               сумма: <b>${r.totals.revenue} ₽</b>,
               средний чек: <b>${r.avgCheck} ₽</b></p>`
            + makeTable(r.rows);
          drawChart(r.rows.map(x => x.day),
                    r.rows.map(x => +x.revenue),
                    'Выручка, ₽');
          csvRows = r.rows;
          break;
        }

        /* 2) Топ-товары */
        case 'top': {
          const rows = await getJSON(`/api/reports/top-products?from=${from}&to=${to}&limit=7`);
          $('#repOut').innerHTML = makeTable(rows);
          drawChart(rows.map(r => r.name), rows.map(r => +r.qty), 'Кол-во продаж');
          csvRows = rows; break;
        }

        /* 3) Остатки */
        case 'stock': {
          const rows = await getJSON('/api/reports/low-stock');
          $('#repOut').innerHTML = makeTable(rows);
          if (chart) chart.destroy();
          csvRows = rows; break;
        }

        /* 4) По сотрудникам */
        case 'staff': {
          const rows = await getJSON(`/api/reports/by-staff?from=${from}&to=${to}`);
          $('#repOut').innerHTML = makeTable(rows);
          drawChart(rows.map(r => r.staff),
                    rows.map(r => +r.revenue),
                    'Выручка, ₽');
          csvRows = rows; break;
        }
      }

      /* кнопка CSV доступна, если есть строки */
      $('#btnCsv').onclick = () =>
        csvRows.length && downloadCSV(csvRows, 'report.csv');

    } catch (err) {
      console.error(err);
      alert('Ошибка: ' + err.message);
      $('#repOut').innerHTML = '<p class="error">Не удалось получить данные отчёта.</p>';
      if (chart) chart.destroy();
    }
  }

  /* ── init: ставим «сегодня» по умолчанию и вешаем события ─── */
  function init() {
    const today = new Date().toISOString().slice(0, 10);
    $('#repFrom').value = today;
    $('#repTo').value   = today;
    $('#repRun').onclick = run;
  }

  return { init };
})();
