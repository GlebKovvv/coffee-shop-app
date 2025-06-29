(function (global) {

  const $    = s => document.querySelector(s);
  const rub  = v => `${(+v).toFixed(2)} ₽`;
  const hhmm = d => new Date(d).toLocaleTimeString('ru-RU',
                      { hour:'2-digit', minute:'2-digit' });

  let timer = null;   // ← чтобы очищать при выходе

  function row(o){
    const wait=(Date.now()-new Date(o.orderdatetime))/60000;
    const cls = wait>5?'danger':'';
    return `<tr data-id="${o.orderid}" class="${cls}">
      <td class="num">${o.ordernumber ?? o.orderid}</td>
      <td>${hhmm(o.orderdatetime)}</td>
      <td class="items">${o.items || '—'}</td>
      <td>${rub(o.totalamount)}</td>
      <td class="st">${o.orderstatusid===1?'Готовится':'Готов'}</td>
      <td><button data-act="done">Готово</button></td>
    </tr>`;
  }

  async function load(){
    /* если мы уже ушли со страницы – ничего не делаем */
    const body = $('#queueBody'); if(!body){ clearInterval(timer); return; }

    const r = await fetch('/api/orders/active');
    if(!r.ok){ console.error(await r.text()); return; }
    body.innerHTML=(await r.json()).map(row).join('');
  }

  async function done(tr){
    await fetch(`/api/orders/${tr.dataset.id}/complete`,{method:'PUT'});
    tr.classList.remove('danger');tr.classList.add('ready');
    tr.querySelector('.st').textContent='Готов';
    tr.querySelector('button').remove();
    setTimeout(()=>tr.remove(),180000);
  }

  function init(){
    load(); timer=setInterval(load,5000);
    $('#queueBody').onclick=e=>{
      if(e.target.dataset.act==='done') done(e.target.closest('tr'));
    };
  }

  global.QUEUE={ init };

})(window);
