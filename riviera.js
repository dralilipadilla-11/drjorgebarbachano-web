/* =============================================================
   Riviera Sleep — autoevaluación "Which door is yours?"
   Todo ocurre en el navegador: no se guarda ni se envía lo que la
   persona marca. Solo se mide qué puerta resultó (sin respuestas).
   ============================================================= */
(function () {
  'use strict';

  var form = document.getElementById('quiz');
  var out = document.getElementById('quizResult');
  if (!form || !out) return;

  var BOOK = 'https://calendly.com/drjorgebarbachano?utm_source=web&utm_medium=quiz-';

  var RESULTS = {
    nose: {
      title: 'Start with the nose.',
      text: 'Your answers point to nasal breathing. In your video evaluation we review your nose ' +
            'and how it affects your nights. Have front and profile photos ready, plus any CT scan.'
    },
    sleep: {
      title: 'Start with your sleep.',
      text: 'Your answers point to how you breathe while you sleep. Snoring and stopping breathing ' +
            'are worth measuring, not guessing. Have any previous sleep study or CPAP data ready.'
    },
    both: {
      title: 'Both doors — the most common answer.',
      text: 'Your nose and your sleep are showing up together. That is exactly what the Riviera ' +
            'Sleep Program is built for: one evaluation that looks at both before deciding anything.'
    }
  };

  var last = '';

  function update() {
    var nose = form.querySelectorAll('[data-door="nose"]:checked').length;
    var sleep = form.querySelectorAll('[data-door="sleep"]:checked').length;

    if (!nose && !sleep) {
      out.innerHTML = '<p class="quiz__lead">Tick at least one box to see where to start.</p>';
      out.classList.remove('is-on');
      last = '';
      return;
    }

    var door = nose && sleep ? 'both' : (nose ? 'nose' : 'sleep');
    var r = RESULTS[door];
    var urgent = form.querySelector('[data-flag="apnea"]:checked') !== null;

    out.innerHTML =
      '<span class="eyebrow">Your starting point</span>' +
      '<h3>' + r.title + '</h3>' +
      '<p>' + r.text + '</p>' +
      (urgent ? '<p class="quiz__flag">If someone has seen you stop breathing, don\'t wait on it — book your evaluation this week.</p>' : '') +
      '<a class="btn btn--dark" href="' + BOOK + door + '" target="_blank" rel="noopener">' +
      'Book video evaluation · $100 USD <span class="arrow" aria-hidden="true">→</span></a>' +
      '<p class="note">This check is not a diagnosis.</p>';
    out.classList.add('is-on');

    if (door !== last && typeof window.jbTrack === 'function') window.jbTrack('quiz_result', { door: door });
    last = door;
  }

  form.addEventListener('change', update);
  form.addEventListener('submit', function (e) { e.preventDefault(); });
})();
