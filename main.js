/* =============================================================
   Dr. Jorge Barbachano — comportamiento del sitio
   Vanilla JS, sin dependencias. Todo es progresivo: si este
   archivo no carga, la página sigue siendo navegable y agendable.
   ============================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Botón flotante de WhatsApp ---------- */
  var waFloat = document.getElementById('waFloat');

  function onScroll() {
    // Aparece tras el 30% de la primera pantalla, para no tapar el hero.
    if (waFloat) waFloat.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.3);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Menú móvil ---------- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('menu');

  function setMenu(open) {
    if (!menu || !toggle) return;
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Cerrar' : (document.documentElement.lang === 'en' ? 'Menu' : 'Menú');
    // Bloquear el scroll de fondo mientras el menú a pantalla completa está abierto.
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(!menu.classList.contains('is-open'));
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });

    // Al pasar a escritorio el menú se oculta por CSS, pero el scroll del body
    // seguiría bloqueado si se dejó abierto en móvil.
    var mq = window.matchMedia('(min-width: 901px)');
    var onMq = function (e) { if (e.matches) setMenu(false); };
    if (mq.addEventListener) mq.addEventListener('change', onMq);
    else if (mq.addListener) mq.addListener(onMq);
  }

  /* ---------- 3. Entrada al viewport (fade + translateY) ---------- */
  var revealables = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 4. Calendly diferido ----------
     El script de Calendly pesa y castiga el LCP si va en el <head>.
     Se inyecta la primera vez que el contenedor se acerca al viewport. */
  var cal = document.getElementById('calendly');

  function loadCalendly() {
    if (!cal || cal.dataset.loaded) return;
    cal.dataset.loaded = '1';

    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(css);

    var js = document.createElement('script');
    js.src = 'https://assets.calendly.com/assets/external/widget.js';
    js.async = true;
    document.body.appendChild(js);
  }

  if (cal) {
    if ('IntersectionObserver' in window) {
      var calIO = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          loadCalendly();
          calIO.disconnect();
        }
      }, { rootMargin: '400px' });
      calIO.observe(cal);
    } else {
      window.addEventListener('load', loadCalendly);
    }
  }

  /* ---------- 5. Año del footer ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
