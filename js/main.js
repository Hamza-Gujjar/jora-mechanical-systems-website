(function () {
  var b = document.querySelector('.burger'), n = document.querySelector('.nav');
  if (b && n) b.addEventListener('click', function () {
    var s = n.classList.toggle('show'); b.setAttribute('aria-expanded', s);
  });
  document.querySelectorAll('.nav button.t').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var li = btn.parentElement, o = li.classList.toggle('open');
      btn.setAttribute('aria-expanded', o);
      document.querySelectorAll('.nav li.open').forEach(function (x) { if (x !== li) x.classList.remove('open'); });
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.querySelectorAll('.nav li.open').forEach(function (x) { x.classList.remove('open'); });
  });
  document.querySelectorAll('[data-year]').forEach(function (e) { e.textContent = new Date().getFullYear(); });
  // postal code finder -> contact page
  var f = document.getElementById('finder');
  if (f) f.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = f.querySelector('input').value.trim().toUpperCase().replace(/\s+/g, '');
    location.href = f.getAttribute('data-go') + '?postal=' + encodeURIComponent(v) + '#quote';
  });
  var p = new URLSearchParams(location.search).get('postal'), pf = document.querySelector('input[name="postal"]');
  if (p && pf) pf.value = p;
  var sv = new URLSearchParams(location.search).get('service'), sf = document.querySelector('select[name="service"]');
  if (sv && sf) sf.value = sv;
  if (location.search.indexOf('sent=1') > -1) {
    var ok = document.getElementById('sent'); if (ok) ok.hidden = false;
  }

  // ---- search ----
  var IDX = window.JORA_INDEX || [], ROOT = window.JORA_ROOT || '';
  function find(q) {
    q = q.toLowerCase().split(/\s+/).filter(Boolean); if (!q.length) return [];
    return IDX.map(function (x) {
      var t = x.t.toLowerCase(), d = x.d.toLowerCase(), sc = 0;
      q.forEach(function (w) { if (t.indexOf(w) > -1) sc += 3; else if (d.indexOf(w) > -1) sc += 1; else sc -= 100; });
      return { x: x, sc: sc };
    }).filter(function (r) { return r.sc > 0; }).sort(function (a, b) { return b.sc - a.sc; }).map(function (r) { return r.x; });
  }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  var sb = document.querySelector('.sbtn'), sf2 = document.querySelector('.sform');
  if (sb && sf2) {
    var inp = sf2.querySelector('input'), box = sf2.querySelector('.sres');
    sb.addEventListener('click', function () {
      var o = sf2.classList.toggle('open'); sb.setAttribute('aria-expanded', o); if (o) inp.focus();
    });
    inp.addEventListener('input', function () {
      var r = find(inp.value).slice(0, 6);
      box.innerHTML = r.length ? r.map(function (x) { return '<a href="' + ROOT + x.u + '"><b>' + esc(x.t) + '</b><span>' + esc(x.d.slice(0, 80)) + '</span></a>'; }).join('') : (inp.value ? '<p>No results. Try "furnace", "heat pump" or a city name.</p>' : '');
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.search')) sf2.classList.remove('open'); });
  }
  var out = document.getElementById('sresults');
  if (out) {
    var qq = new URLSearchParams(location.search).get('q') || '', si = document.getElementById('sq'); if (si) si.value = qq;
    var rs = find(qq);
    out.innerHTML = qq ? (rs.length ? '<p>' + rs.length + ' result' + (rs.length > 1 ? 's' : '') + ' for <b>' + esc(qq) + '</b></p>' + rs.map(function (x) {
      return '<div style="margin-bottom:18px"><a href="' + ROOT + x.u + '"><b style="font-size:1.1rem">' + esc(x.t) + '</b></a><br><span style="color:#6b655f">' + esc(x.d) + '</span></div>'; }).join('') : '<p>No results for <b>' + esc(qq) + '</b>. Try another word, or <a href="' + ROOT + 'contact.html">contact us</a>.</p>') : '';
  }
})();
