/* ============================================================
   VÉA MEDICAL — main.js
   Sin dependencias externas. Sin scroll-jacking.
   ============================================================ */

// ---------- Año dinámico en el footer ----------
document.querySelectorAll('[data-year]').forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// ---------- Menú móvil ----------
(function () {
  var burger = document.querySelector('.nav-burger');
  var menu = document.querySelector('.mobile-menu');
  if (!burger || !menu) return;

  function closeMenu() {
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  function openMenu() {
    menu.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  burger.addEventListener('click', function () {
    var isOpen = burger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
})();

// ---------- Método VÉA 360° — tabs accesibles, click/teclado, sin capturar scroll ----------
(function () {
  var root = document.querySelector('[data-method]');
  if (!root) return;

  var steps = Array.from(root.querySelectorAll('.method-step'));
  var panelTitle = root.querySelector('[data-method-title]');
  var panelLead = root.querySelector('[data-method-lead]');
  var panelKicker = root.querySelector('[data-method-kicker]');
  var progressBar = root.querySelector('.method-progress-bar');
  var prevBtn = root.querySelector('[data-method-prev]');
  var nextBtn = root.querySelector('[data-method-next]');

  var data = steps.map(function (btn) {
    return {
      title: btn.getAttribute('data-title'),
      lead: btn.getAttribute('data-lead')
    };
  });

  var current = 0;
  var autoplayId = null;
  var AUTOPLAY_MS = 5500;

  function render(i, focusPanel) {
    current = (i + data.length) % data.length;
    steps.forEach(function (btn, idx) {
      var selected = idx === current;
      btn.setAttribute('aria-selected', String(selected));
      btn.tabIndex = selected ? 0 : -1;
    });
    if (panelTitle) panelTitle.textContent = data[current].title;
    if (panelLead) panelLead.textContent = data[current].lead;
    if (panelKicker) panelKicker.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(data.length).padStart(2, '0');
    if (progressBar) progressBar.style.width = ((current + 1) / data.length * 100) + '%';
  }

  function stopAutoplay() {
    if (autoplayId) { clearInterval(autoplayId); autoplayId = null; }
  }
  function startAutoplay() {
    stopAutoplay();
    autoplayId = setInterval(function () { render(current + 1); }, AUTOPLAY_MS);
  }

  steps.forEach(function (btn, idx) {
    btn.addEventListener('click', function () { stopAutoplay(); render(idx); startAutoplay(); });
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); stopAutoplay(); render(idx + 1); steps[current].focus(); startAutoplay(); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); stopAutoplay(); render(idx - 1); steps[current].focus(); startAutoplay(); }
    });
  });
  if (prevBtn) prevBtn.addEventListener('click', function () { stopAutoplay(); render(current - 1); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { stopAutoplay(); render(current + 1); startAutoplay(); });

  // Pausa el autoplay si la sección no está visible — nunca fija ni captura el scroll.
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) startAutoplay(); else stopAutoplay();
    });
  }, { threshold: 0.4 });
  observer.observe(root);

  render(0);
})();

// ---------- Calculadora de ROI (Por qué VÉA) ----------
(function () {
  var calc = document.querySelector('[data-roi-calc]');
  if (!calc) return;

  var inversion = calc.querySelector('[data-input="inversion"]');
  var precio = calc.querySelector('[data-input="precio"]');
  var volumen = calc.querySelector('[data-input="volumen"]');
  var costo = calc.querySelector('[data-input="costo"]');

  var outIngresos = calc.querySelector('[data-output="ingresos"]');
  var outMargen = calc.querySelector('[data-output="margen"]');
  var outRecuperacion = calc.querySelector('[data-output="recuperacion"]');

  function fmt(n) {
    return 'RD$' + Math.round(n).toLocaleString('es-DO');
  }

  function update() {
    var inv = Number(inversion.value) || 0;
    var p = Number(precio.value) || 0;
    var v = Number(volumen.value) || 0;
    var c = Number(costo.value) || 0;

    var ingresos = p * v;
    var margenUnitario = Math.max(p - c, 0);
    var margen = margenUnitario * v;
    var meses = margen > 0 ? Math.ceil(inv / margen) : 0;

    var MONEY_KEYS = ['inversion', 'precio', 'costo'];
    calc.querySelectorAll('[data-echo]').forEach(function (el) {
      var key = el.getAttribute('data-echo');
      var input = calc.querySelector('[data-input="' + key + '"]');
      if (input) el.textContent = MONEY_KEYS.indexOf(key) !== -1 ? fmt(input.value) : input.value;
    });

    if (outIngresos) outIngresos.textContent = fmt(ingresos);
    if (outMargen) outMargen.textContent = fmt(margen);
    if (outRecuperacion) outRecuperacion.textContent = meses + (meses === 1 ? ' mes' : ' meses');
  }

  [inversion, precio, volumen, costo].forEach(function (input) {
    if (input) input.addEventListener('input', update);
  });
  update();
})();

// ---------- Fichas técnicas dinámicas: tabs por producto ----------
(function () {
  document.querySelectorAll('[data-specsheet]').forEach(function (root) {
    var tabs = Array.from(root.querySelectorAll('.spec-tab'));
    var panels = Array.from(root.querySelectorAll('.spec-panel'));
    function select(i) {
      tabs.forEach(function (t, idx) { t.setAttribute('aria-selected', String(idx === i)); t.tabIndex = idx === i ? 0 : -1; });
      panels.forEach(function (p, idx) { p.hidden = idx !== i; });
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(i); });
      tab.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); var n = (i + 1) % tabs.length; select(n); tabs[n].focus(); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); var p = (i - 1 + tabs.length) % tabs.length; select(p); tabs[p].focus(); }
      });
    });
    select(0);
  });
})();

// ---------- Scanline: se activa una vez al entrar en viewport (respeta reduced-motion) ----------
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  var targets = document.querySelectorAll('.spec-visual[data-scan]');
  if (!targets.length) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-scanning');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  targets.forEach(function (t) { obs.observe(t); });
})();

// ---------- Contadores animados (stats de ficha técnica) ----------
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('[data-count-to]');
  if (!els.length) return;
  function animate(el) {
    var to = parseFloat(el.getAttribute('data-count-to'));
    var suffix = el.getAttribute('data-count-suffix') || '';
    var prefix = el.getAttribute('data-count-prefix') || '';
    if (reduce || isNaN(to)) { el.textContent = prefix + to + suffix; return; }
    var start = null, dur = 900;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(to * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { animate(entry.target); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.6 });
  els.forEach(function (el) { obs.observe(el); });
})();

// ---------- Formularios: validación + estado de éxito (sin backend conectado) ----------
// TODO(Ana / desarrollo): estos formularios muestran el estado de éxito en el cliente
// pero NO envían los datos a ningún lado todavía. Conectar FORM_ENDPOINT a tu backend
// real (Google Apps Script, N8N webhook, Zoho, Formspree, etc.) antes de publicar,
// o los leads no llegarán a ninguna parte.
var FORM_ENDPOINT = ''; // <-- pegar aquí la URL del endpoint real

(function () {
  document.querySelectorAll('[data-lead-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = form.querySelector('.form-success');

      if (FORM_ENDPOINT) {
        fetch(FORM_ENDPOINT, {
          method: 'POST',
          body: new FormData(form)
        }).catch(function (err) {
          console.error('Error enviando el formulario VÉA:', err);
        });
      } else {
        console.warn('[VÉA] FORM_ENDPOINT no configurado — el formulario no se está enviando a ningún backend todavía.');
      }

      form.classList.add('is-submitted');
      if (success) success.classList.add('is-visible');
      form.reset();
    });
  });
})();
