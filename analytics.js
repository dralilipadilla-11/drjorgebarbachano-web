/* =============================================================
   Dr. Jorge Barbachano — medición (GA4 + Google Ads)
   Vanilla JS, sin dependencias. Si los IDs están vacíos no carga
   nada de Google: el sitio funciona igual y no se rastrea a nadie.

   Para activar, llena los IDs de abajo (los da Google Ads / GA4):
     GA4_ID         → GA4 · Administrar · Flujos de datos     (G-XXXXXXX)
     ADS_ID         → Google Ads · Objetivos · Conversiones   (AW-XXXXXXX)
     ADS_LABELS.*   → la "etiqueta" de cada acción de conversión

   Eventos que se envían:
     calendly_booked  cita confirmada en el calendario embebido  ← conversión principal
     calendly_click   clic a cualquier enlace de Calendly
     whatsapp_click   clic a cualquier enlace de WhatsApp
     phone_click      clic a un enlace tel:
   ============================================================= */
(function () {
  'use strict';

  var GA4_ID = '';
  var ADS_ID = '';
  var ADS_LABELS = {
    calendly_booked: '',
    whatsapp_click: '',
    calendly_click: ''
  };

  var params = new URLSearchParams(window.location.search);
  var market = document.documentElement.lang === 'en' ? 'international' : 'mexico';

  /* ---------- 1. Atribución hacia Calendly ----------
     Calendly guarda los utm_ de la URL con la que se agendó. Si el visitante
     llegó desde un anuncio, se pasa la campaña a todos los enlaces y embeds
     para que la cita muestre de dónde vino, aun sin GA4 activo. */
  var fromAds = params.has('gclid') || params.has('gbraid') || params.has('wbraid');
  var campaign = params.get('utm_campaign') || (fromAds ? 'google-ads' : '');
  var source = params.get('utm_source') || (fromAds ? 'google' : '');

  function tagCalendly(url) {
    try {
      var u = new URL(url, window.location.href);
      if (source) u.searchParams.set('utm_source', source);
      if (campaign) u.searchParams.set('utm_campaign', campaign);
      if (params.get('utm_term')) u.searchParams.set('utm_term', params.get('utm_term'));
      return u.toString();
    } catch (e) { return url; }
  }

  if (source || campaign) {
    document.querySelectorAll('a[href*="calendly.com"]').forEach(function (a) {
      a.href = tagCalendly(a.href);
    });
    document.querySelectorAll('.calendly-inline-widget[data-url]').forEach(function (el) {
      el.setAttribute('data-url', tagCalendly(el.getAttribute('data-url')));
    });
  }

  /* ---------- 2. gtag ---------- */
  if (!GA4_ID && !ADS_ID) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag('js', new Date());
  if (GA4_ID) gtag('config', GA4_ID, { market: market });
  if (ADS_ID) gtag('config', ADS_ID);

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + (GA4_ID || ADS_ID);
  document.head.appendChild(s);

  function track(name, detail) {
    var data = Object.assign({ market: market, page: window.location.pathname }, detail || {});
    data.transport_type = 'beacon';
    gtag('event', name, data);
    if (ADS_ID && ADS_LABELS[name]) {
      gtag('event', 'conversion', { send_to: ADS_ID + '/' + ADS_LABELS[name], transport_type: 'beacon' });
    }
  }

  // Para scripts de página (p. ej. la autoevaluación de riviera.js).
  window.jbTrack = track;

  /* ---------- 3. Clics ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    var where = a.dataset.track || (a.closest('section, header, footer, .menu') || {}).id || '';

    if (/wa\.me|whatsapp\.com/.test(href)) track('whatsapp_click', { block: where });
    else if (/calendly\.com/.test(href)) track('calendly_click', { block: where });
    else if (/^tel:/.test(href)) track('phone_click', { block: where });
  }, true);

  /* ---------- 4. Cita confirmada en el embed de Calendly ---------- */
  window.addEventListener('message', function (e) {
    if (e.origin !== 'https://calendly.com' || !e.data || typeof e.data.event !== 'string') return;
    if (e.data.event === 'calendly.event_scheduled') track('calendly_booked');
  });
})();
