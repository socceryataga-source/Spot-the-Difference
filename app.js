(() => {
'use strict';
const $ = id => document.getElementById(id);
const catalog = Array.isArray(window.GRAMMAR_CATALOG) ? window.GRAMMAR_CATALOG : [];
let role = 'A', remaining = 120, tick = null, running = false, selectedGrammar = null, selectedSet = null;

function show(id) {
  for (const screen of ['home', 'play', 'done']) $(screen).classList.toggle('hidden', screen !== id);
  window.scrollTo(0, 0);
}
function topic() { return catalog.find(x => x.id === $('grammar').value); }
function populateSets() {
  const t = topic();
  $('set').replaceChildren();
  if (!t) return;
  for (const s of (t.sets || [])) {
    const option = document.createElement('option');
    option.value = s.id;
    option.textContent = `Set ${Number(s.id)} · ${s.title}${s.level ? ` (${s.level})` : ''}`;
    $('set').append(option);
  }
  $('start').disabled = !(t.sets || []).length;
}
for (const t of catalog) {
  const o = document.createElement('option');
  o.value = t.id;
  o.textContent = t.title;
  $('grammar').append(o);
}
$('grammar').addEventListener('change', populateSets);
populateSets();
document.querySelectorAll('.role').forEach(b => b.addEventListener('click', () => {
  role = b.dataset.role;
  document.querySelectorAll('.role').forEach(x => {
    const active = x === b;
    x.classList.toggle('active', active);
    x.setAttribute('aria-pressed', String(active));
  });
}));

// Resolve image paths using a topic's naming rule, with per-set overrides.
// Existing infinitives and new participles can use different filename styles.
function imagePath(t, s, r) {
  const override = s.images?.[r];
  if (override) return /^(?:https?:\/\/|\/)/i.test(override) ? override : `${t.folder}/${override}`;
  const pattern = t.imagePattern || 'set{id}_{role}.png';
  const caseRole = t.roleCase === 'upper' ? r.toUpperCase() : r.toLowerCase();
  return `${t.folder}/${pattern.replaceAll('{id}', String(s.id)).replaceAll('{role}', caseRole)}`;
}

function stop() {
  clearInterval(tick);
  tick = null;
  running = false;
  $('timer-toggle').textContent = 'Start timer';
}
function clock() {
  $('timer').textContent = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
}
function resetClock() {
  stop(); remaining = 120; clock(); $('timer').classList.remove('time-up');
}
function startClock() {
  if (running) return;
  if (remaining <= 0) remaining = 120;
  running = true;
  $('timer-toggle').textContent = 'Pause';
  tick = setInterval(() => {
    remaining = Math.max(0, remaining - 1);
    clock();
    if (remaining === 0) { stop(); $('timer').classList.add('time-up'); }
  }, 1000);
}
function play() {
  selectedGrammar = topic();
  selectedSet = selectedGrammar?.sets?.find(x => x.id === $('set').value);
  if (!selectedSet) return;
  resetClock();
  $('topic-label').textContent = selectedGrammar.title.toUpperCase();
  $('game-title').textContent = `Set ${Number(selectedSet.id)} — ${selectedSet.title}`;
  $('game-subtitle').textContent = `${selectedSet.level ? `${selectedSet.level.toUpperCase()} · ` : ''}STUDENT ${role}`;
  const img = $('picture');
  $('image-error').classList.add('hidden');
  img.classList.remove('hidden');
  img.onerror = () => {
    img.classList.add('hidden');
    $('image-error').classList.remove('hidden');
  };
  img.src = imagePath(selectedGrammar, selectedSet, role);
  img.alt = `Student ${role}: ${selectedSet.title}`;
  show('play');
  startClock();
}
$('start').addEventListener('click', play);
$('timer-toggle').addEventListener('click', () => { if (running) stop(); else startClock(); });
$('timer-reset').addEventListener('click', resetClock);
function home() { stop(); show('home'); }
$('home-btn').addEventListener('click', home);
$('another').addEventListener('click', home);
$('again').addEventListener('click', home);
$('finish').addEventListener('click', () => {
  stop();
  $('done-summary').textContent = `Student ${role} · ${selectedSet.title}`;
  show('done');
});

// Chrome on-device Translator API, with optional public online fallback.
let translator = null, backend = null, translateTimer = null, latestTranslation = 0;
const status = $('translation-status'), input = $('jp-input'), output = $('en-output');
$('enable-translate').addEventListener('click', async () => {
  status.textContent = 'Checking translation support…';
  if ('Translator' in window) {
    try {
      const availability = await Translator.availability({sourceLanguage: 'ja', targetLanguage: 'en'});
      if (availability !== 'unavailable') {
        status.textContent = 'Preparing on-device translator… (first use may download a language pack)';
        translator = await Translator.create({
          sourceLanguage: 'ja', targetLanguage: 'en',
          monitor(m) { m.addEventListener('downloadprogress', e => { status.textContent = 'Downloading language pack: ' + Math.round(e.loaded * 100) + '%'; }); }
        });
        backend = 'device'; status.textContent = 'On-device translation ready'; translateInput(); return;
      }
    } catch (e) { console.warn('Translator API unavailable', e); }
  }
  backend = 'online';
  status.textContent = 'Online mode: text is sent to MyMemory translation service';
  translateInput();
});
async function translateInput() {
  const q = input.value.trim(), token = ++latestTranslation;
  if (!q) { output.textContent = 'Type Japanese to see an English translation.'; return; }
  if (!backend) { output.textContent = 'Select “Enable translation” first.'; return; }
  output.textContent = 'Translating…';
  try {
    let english;
    if (backend === 'device') english = await translator.translate(q);
    else {
      const api = 'https://api.mymemory.translated.net/get?langpair=ja%7Cen&q=' + encodeURIComponent(q);
      const r = await fetch(api);
      if (!r.ok) throw Error('HTTP ' + r.status);
      const data = await r.json();
      if (!data.responseData?.translatedText || data.responseStatus !== 200) throw Error('Service error');
      english = data.responseData.translatedText;
    }
    if (token === latestTranslation) output.textContent = english;
  } catch (e) {
    if (token === latestTranslation) {
      output.textContent = 'Translation unavailable. Please try again.';
      status.textContent = 'Translation service unavailable';
    }
  }
}
input.addEventListener('input', () => {
  clearTimeout(translateTimer);
  translateTimer = setTimeout(translateInput, 500);
});
$('copy-en').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(output.textContent); status.textContent = 'Copied!'; }
  catch (e) { status.textContent = 'Could not copy.'; }
});
$('fullscreen').addEventListener('click', () => {
  const wrap = document.querySelector('.photo-wrap');
  if (!document.fullscreenElement) wrap.requestFullscreen?.();
  else document.exitFullscreen?.();
});
})();
