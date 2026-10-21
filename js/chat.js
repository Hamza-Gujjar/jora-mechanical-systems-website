(function () {
  var D = window.JORA_CHAT, ROOT = window.JORA_ROOT || '';
  if (!D) return;
  var fab = document.getElementById('fab'), fbtn = document.getElementById('fabbtn'), chat = document.getElementById('chat'),
      body = document.getElementById('chatb'), qs = document.getElementById('chatq'), form = document.getElementById('chatf'), inp = document.getElementById('chati');
  if (!fab || !chat) return;

  function setMenu(o) { fab.classList.toggle('open', o); fbtn.setAttribute('aria-expanded', o); }
  fbtn.addEventListener('click', function () { setMenu(!fab.classList.contains('open')); });
  document.addEventListener('click', function (e) { if (!e.target.closest('#fab') && !e.target.closest('#chat')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); closeChat(); } });

  var started = false;
  function openChat() {
    setMenu(false); chat.hidden = false; fab.classList.add('hide'); document.body.classList.add('chat-open');
    if (!started) { started = true; bot('Hi! I am the Jora Mechanical Systems assistant. I can help with services, service areas and getting a free quote. What can I help you with?'); quick(['Get a free quote', 'Furnace', 'Air conditioner', 'Heat pump', 'Water heater', 'Service areas', 'Talk to a person']); }
    setTimeout(function () { inp.focus(); }, 50);
  }
  function closeChat() { chat.hidden = true; fab.classList.remove('hide'); document.body.classList.remove('chat-open'); }
  document.getElementById('openchat').addEventListener('click', openChat);
  document.getElementById('chatx').addEventListener('click', closeChat);

  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]; }); }
  function add(cls, html) { var d = document.createElement('div'); d.className = 'm ' + cls; d.innerHTML = html; body.appendChild(d); body.scrollTop = body.scrollHeight; return d; }
  function links(arr) { return arr && arr.length ? '<div class="ml">' + arr.map(function (l) { var ext = /^(https?:|tel:|mailto:)/.test(l[1]); return '<a href="' + (ext ? l[1] : ROOT + l[1]) + '"' + (/^https/.test(l[1]) ? ' target="_blank" rel="noopener"' : '') + '>' + esc(l[0]) + '</a>'; }).join('') + '</div>' : ''; }
  function quick(a) { qs.innerHTML = ''; a.forEach(function (t) { var b = document.createElement('button'); b.type = 'button'; b.textContent = t; b.addEventListener('click', function () { send(t); }); qs.appendChild(b); }); }
  function bot(text, l, q) {
    var t = add('bot typing', '<span></span><span></span><span></span>');
    setTimeout(function () { t.className = 'm bot'; t.innerHTML = text + links(l); body.scrollTop = body.scrollHeight; if (q) quick(q); }, 450);
  }
  var contact = [['WhatsApp us', D.wa], ['Call ' + D.phone, 'tel:' + D.tel], ['Email us', 'mailto:' + D.email]];
  var topics = ['Get a free quote', 'Furnace', 'Air conditioner', 'Heat pump', 'Water heater', 'Service areas'];

  function svc(slug) { for (var i = 0; i < D.services.length; i++) if (D.services[i].u.indexOf(slug) > -1) return D.services[i]; }
  var intents = [
    { r: /\b(hi|hello|hey|salam|assalam)/, f: function () { return ['Hello! How can I help you today?', null, topics]; } },
    { r: /(thank|thanks|shukria)/, f: function () { return ['You are welcome! Anything else I can help with?', null, ['Get a free quote', 'Talk to a person']]; } },
    { r: /(quote|estimate|price|cost|how much|book|appointment|schedule)/, f: function () { return ['We offer free in-home estimates with clear written quotes. Fill in the short quote form, or message us on WhatsApp with your address and what you need.', [['Get a free quote', 'get-a-quote.html'], ['WhatsApp us', D.wa], ['Call ' + D.phone, 'tel:' + D.tel]], ['Furnace', 'Air conditioner', 'Service areas']]; } },
    { r: /(person|human|agent|speak|talk|someone|call|phone|whatsapp|contact|number|email)/, f: function () { return ['Of course. You can reach our team here:', contact.concat([['Contact page', 'contact.html']]), ['Get a free quote', 'Service areas']]; } },
    { r: /(hour|open|close|emergency|urgent|24|weekend|today|asap)/, f: function () { return ['For availability, hours and urgent calls, please phone or message us directly so we can give you the earliest time.', contact, null]; } },
    { r: /(financ|payment plan|monthly|lease|rent)/, f: function () { return ['We can explain financing options for new installations when we prepare your quote.', [['Financing details', 'financing.html'], ['Get a free quote', 'get-a-quote.html']], null]; } },
    { r: /(offer|deal|promo|discount|rebate|incentive)/, f: function () { return ['We have a free in-home estimate and seasonal specials. Current offers change, so ask us what applies to your project.', [['See offers', 'offers.html'], ['Call ' + D.phone, 'tel:' + D.tel]], null]; } },
    { r: /(plan|maintenance|tune|service plan|protect)/, f: function () { return ['We offer annual tune-ups for furnaces, boilers, air conditioners and water heaters.', [['Maintenance plans', 'plans.html']], ['Get a free quote']]; } },
    { r: /(work|photo|project|gallery|portfolio)/, f: function () { return ['You can see photos of our recent installations here:', [['Our work', 'work-history.html']], null]; } },
    { r: /(blog|article|tips|advice)/, f: function () { return ['Our Ask an Expert articles cover heat pumps, furnace care, AC and more:', [['Read the blog', 'blog/index.html']], null]; } },
    { r: /(area|serve|service area|location|city|where|postal|near)/, f: function (t) { var hit = D.areas.filter(function (a) { return t.indexOf(a.n.toLowerCase()) > -1; })[0]; if (hit) return ['Yes, we serve ' + hit.n + '. Tap below to see services there, or request a free quote.', [[hit.n + ' services', hit.u], ['Get a free quote', 'get-a-quote.html']], null]; return ['We serve ' + D.areas.map(function (a) { return a.n; }).join(', ') + '. Tell me your city or postal code and we will confirm.', [['All service areas', 'areas/index.html']], null]; } }
  ];
  var cityRe = new RegExp('(' + D.areas.map(function (a) { return a.n.toLowerCase(); }).join('|') + ')');
  var svcMap = [
    [/(heat pump|heatpump|geothermal)/, 'heat-pump'], [/(tankless|on demand)/, 'tankless'], [/(water heater|hot water|water tank|tank|geyser)/, 'water-heater'],
    [/(ductless|mini.?split)/, 'ductless'], [/(air condition|\bac\b|a\/c|cooling|central air)/, 'air-conditioner'], [/(furnace|heating|no heat|propane)/, 'furnace'],
    [/(combi|boiler|radiator)/, 'boiler'], [/(plumb|leak|pipe|drain|faucet|toilet)/, 'plumbing'], [/(duct)/, 'duct-work'], [/(humidif|air quality|filter)/, 'humidifier'],
    [/(thermostat|smart home)/, 'smart-home'], [/(commercial|rooftop|business|office|restaurant)/, 'commercial'], [/(repair|broken|not working|fix|noise|stopped)/, 'hvac-repair']
  ];
  function answer(raw) {
    var t = raw.toLowerCase();
    if (cityRe.test(t) && !/(furnace|heat pump|water|air cond|\bac\b)/.test(t)) return intents[intents.length - 1].f(t);
    for (var i = 0; i < svcMap.length; i++) if (svcMap[i][0].test(t)) {
      var s = svc(svcMap[i][1]); if (s) return [s.n + ': ' + s.s + ' We offer free in-home estimates.', [['Learn about ' + s.n.toLowerCase(), s.u], ['Get a free quote', 'get-a-quote.html']], ['Get a free quote', 'Service areas', 'Talk to a person']];
    }
    for (var j = 0; j < intents.length; j++) if (intents[j].r.test(t)) return intents[j].f(t);
    return ['I am not sure I understood that. Pick a topic below, or talk to our team directly.', contact, topics];
  }
  function send(text) {
    text = (text || '').trim(); if (!text) return;
    add('me', esc(text)); qs.innerHTML = ''; inp.value = '';
    var a = answer(text); bot(a[0], a[1], a[2]);
  }
  form.addEventListener('submit', function (e) { e.preventDefault(); send(inp.value); });
})();
