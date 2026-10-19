// Maxwell Coach · UP QROO
// Cuestionario tipo Tinder de liderazgo académico en 4 colores.
(() => {
'use strict';

const CFG = Object.assign({ sheetsUrl: '', facilitatorPin: '2026', colorCards: false, showTimer: true, timeLimit: 240 }, window.MAXWELL_CONFIG || {});
const LIMIT = Math.max(1, +CFG.timeLimit || 240);

const STYLES = [
  { key: 'rojo', name: 'Rojo Directivo', short: 'Directivo', color: '#C62828', ink: '#C62828', fg: '#FFFFFF', chip: 'rgba(0,0,0,.18)',
    tagline: 'Marcas el rumbo y movilizas al equipo hacia resultados.',
    summary: n => `${n} asume la conducción con naturalidad: define metas claras, decide con rapidez y sostiene el ritmo cuando un proyecto académico se complica.`,
    strengths: ['Claridad en metas y prioridades', 'Decisión ante la incertidumbre', 'Capacidad para destrabar proyectos'],
    blind: ['Puede avanzar sin escuchar a todos los involucrados', 'La urgencia puede percibirse como presión'],
    tip: 'Antes de tu próxima decisión importante, pide su punto de vista a dos docentes y explica al equipo el porqué, no solo el qué.' },
  { key: 'amarillo', name: 'Amarillo Innovador', short: 'Innovador', color: '#F2A100', ink: '#B87A00', fg: '#040404', chip: 'rgba(0,0,0,.10)',
    tagline: 'Imaginas nuevas posibilidades y contagias entusiasmo.',
    summary: n => `${n} piensa en el futuro del programa, propone formas distintas de enseñar y reúne al equipo alrededor de ideas nuevas.`,
    strengths: ['Visión de largo plazo', 'Creatividad para resolver problemas', 'Energía que motiva al equipo'],
    blind: ['Puede iniciar más proyectos de los que concluye', 'Los detalles operativos quedan en segundo plano'],
    tip: 'Elige una sola iniciativa para este semestre y asígnale un responsable y una fecha de cierre.' },
  { key: 'verde', name: 'Verde Empoderador', short: 'Empoderador', color: '#2E8B57', ink: '#2E8B57', fg: '#FFFFFF', chip: 'rgba(0,0,0,.18)',
    tagline: 'Desarrollas a las personas y construyes acuerdos.',
    summary: n => `${n} escucha antes de opinar, delega con confianza y se ocupa de que docentes y estudiantes crezcan. Su liderazgo se mide en el desarrollo de otros.`,
    strengths: ['Escucha activa y empatía', 'Delegación que forma nuevos líderes', 'Clima de confianza en el equipo'],
    blind: ['Puede evitar conversaciones difíciles', 'Buscar consenso puede alargar las decisiones'],
    tip: 'Agenda esta semana una conversación de retroalimentación pendiente: sé claro con la expectativa y generoso con el apoyo.' },
  { key: 'azul', name: 'Azul Analítico', short: 'Analítico', color: '#2F6DB5', ink: '#2F6DB5', fg: '#FFFFFF', chip: 'rgba(0,0,0,.18)',
    tagline: 'Decides con evidencia y construyes procesos sólidos.',
    summary: n => `${n} se apoya en datos, indicadores y procedimientos. Cuida la calidad académica y anticipa riesgos antes de que se conviertan en problemas.`,
    strengths: ['Rigor en el análisis y la planeación', 'Procesos claros y documentados', 'Atención al detalle y a la calidad'],
    blind: ['Puede retrasar decisiones esperando más información', 'Los cambios rápidos le generan resistencia'],
    tip: 'Define de antemano qué información es suficiente; cuando la tengas, decide y ajusta sobre la marcha.' }
];

// [código, enunciado, aspecto, esNegativa, colorDeTarjeta] — en una negativa, "En desacuerdo" suma +1
const BANK = {
  rojo: [
    ['R1', 'Soy naturalmente muy competitivo con los demás y me impulsa ganar.', 'Enfocado en resultados', false, '#882329'],
    ['R2', 'A veces soy tan directo e impaciente que termino hiriendo o molestando a la gente.', 'Enfocado en resultados', true, '#C9381E'],
    ['R3', 'Me siento muy cómodo asumiendo el control y dirigiendo en situaciones de grupo.', 'Extrovertido', false, '#C9381E'],
    ['R4', 'Me obsesiona tanto ganar que llego a pasar por alto las necesidades de los demás.', 'Enfocado en resultados', true, '#882329'],
    ['R5', 'Disfruto siendo el centro de atención y expresando mi energía abiertamente.', 'Extrovertido', false, '#C9381E'],
    ['R6', 'Mi necesidad de tener el mando resulta a menudo dominante y agobiante para mi entorno.', 'Extrovertido', true, '#C9381E'],
    ['R7', 'Me conocen como alguien tenaz que no desiste hasta ver la meta cumplida.', 'Enfocado en resultados', false, '#882329'],
    ['R8', 'Al debatir un punto, los demás a veces me perciben agresivo o inflexible.', 'Enfocado en resultados', true, '#882329'],
    ['R9', 'Disfruto evaluando críticamente las ideas y sosteniendo debates exigentes.', 'Enfocado en resultados', false, '#D66B24'],
    ['R10', 'A veces presiono mis opiniones de forma tan vehemente que anulo las posturas ajenas.', 'Extrovertido', true, '#C9381E'],
    ['R11', 'Me esfuerzo constantemente por superar el rendimiento de mis colegas.', 'Enfocado en resultados', false, '#882329'],
    ['R12', 'Mi nivel de entusiasmo y volumen de energía llega a abrumar o agotar a quienes me rodean.', 'Extrovertido', true, '#C9381E'],
    ['R13', 'Soy un negociador duro que prioriza alcanzar el objetivo planteado.', 'Enfocado en resultados', false, '#882329']
  ],
  azul: [
    ['A1', 'Cuando trabajo en una tarea soy sumamente estructurado y metódico.', 'Disciplinado', false, '#7B3060'],
    ['A2', 'Pierdo tanto tiempo organizando y detallando que me cuesta pasar a la acción.', 'Disciplinado', true, '#7B3060'],
    ['A3', 'Es fundamental para mí verificar y contrastar todos los hechos antes de decidir.', 'Aterrizado', false, '#2F4A96'],
    ['A4', 'Mi necesidad de ser objetivo me hace parecer una persona fría o distante ante los demás.', 'Aterrizado', true, '#1B3B87'],
    ['A5', 'Creo firmemente en cumplir siempre mis compromisos y plazos establecidos.', 'Disciplinado', false, '#7B3060'],
    ['A6', 'Me vuelvo tan rígido con los métodos tradicionales que me resisto a cualquier cambio necesario.', 'Aterrizado', true, '#215CAE'],
    ['A7', 'La atención minuciosa al detalle y la precisión es una de mis fortalezas clave.', 'Disciplinado', false, '#7B3060'],
    ['A8', 'A veces me pierdo en los detalles minuciosos y pierdo la visión del panorama general.', 'Disciplinado', true, '#7B3060'],
    ['A9', 'Evito teorizar y me enfoco en lo concreto, práctico y verificable.', 'Aterrizado', false, '#1B3B87'],
    ['A10', 'Mi afán por la exactitud y la precisión puede volverse excesivo y retrasar las entregas.', 'Disciplinado', true, '#7B3060'],
    ['A11', 'Analizo las situaciones de manera lógica y racional sin involucrar emociones.', 'Aterrizado', false, '#2F4A96'],
    ['A12', 'Soy tan realista y estricto con los datos que cierro el paso a explorar hipótesis creativas.', 'Aterrizado', true, '#1B3B87'],
    ['A13', 'Manejo bien y con paciencia las tareas repetitivas que demandan gran rigor técnico.', 'Disciplinado', false, '#7B3060']
  ],
  amarillo: [
    ['Y1', 'Soy naturalmente inclinado a pensar en el panorama global e identificar patrones.', 'Pensador de panorama global', false, '#D66B24'],
    ['Y2', 'Me pierdo tanto en la imaginación y las teorías que descuido la viabilidad real.', 'Pensador de panorama global', true, '#D66B24'],
    ['Y3', 'Tiendo a mantener mis planes informales para tener abiertas todas mis opciones.', 'Inspirado', false, '#B6BE34'],
    ['Y4', 'Mi falta de planeación y orden me causa retrasos o incumplimiento de fechas límite.', 'Inspirado', true, '#B6BE34'],
    ['Y5', 'Disfruto profundamente siendo una fuente constante de ideas disruptivas.', 'Pensador de panorama global', false, '#D66B24'],
    ['Y6', 'A menudo propongo o inicio cambios solo por aburrimiento, sin que exista una necesidad real.', 'Pensador de panorama global', true, '#D66B24'],
    ['Y7', 'No creo que la tradición o la costumbre deba interponerse ante un cambio conveniente.', 'Pensador de panorama global', false, '#D66B24'],
    ['Y8', 'Puedo ser tan adaptable y cambiar de rumbo con tanta facilidad que pierdo el foco original.', 'Inspirado', true, '#B6BE34'],
    ['Y9', 'Disfruto trabajar en entornos flexibles donde las ideas fluyan sin objetivos rígidos.', 'Inspirado', false, '#B6BE34'],
    ['Y10', 'A veces complico innecesariamente problemas que admitían una solución directa y sencilla.', 'Pensador de panorama global', true, '#D66B24'],
    ['Y11', 'Me entusiasma improvisar soluciones espontáneas cuando el contexto cambia repentinamente.', 'Inspirado', false, '#B6BE34'],
    ['Y12', 'Ha habido ocasiones en que he actuado por mero impulso y después he lamentado no reflexionar.', 'Inspirado', true, '#B6BE34']
  ],
  verde: [
    ['G1', 'Soy naturalmente muy empático y comprendo el punto de vista ajeno.', 'Enfocado en las personas', false, '#4B7C37'],
    ['G2', "Por complacer a los demás y evitar roces, me cuesta muchísimo decir 'no' o poner límites.", 'Enfocado en las personas', true, '#4B7C37'],
    ['G3', 'Me gusta escuchar con atención a los demás antes de compartir mi postura.', 'Introvertido', false, '#1E5AA8'],
    ['G4', 'Invierto tanto tiempo cuidando a los demás que descuido mis propios objetivos prioritarios.', 'Enfocado en las personas', true, '#4B7C37'],
    ['G5', 'Le doy prioridad a la armonía grupal y a encontrar puntos en común donde todos ganen.', 'Enfocado en las personas', false, '#4B7C37'],
    ['G6', 'Puedo ser tan diplomático y reacio a la discusión que evito tomar una postura clara y firme.', 'Enfocado en las personas', true, '#4B7C37'],
    ['G7', 'Disfruto profundamente colaborar en equipo en lugar de competir individualmente.', 'Enfocado en las personas', false, '#4B7C37'],
    ['G8', 'A veces cedo en mi posición durante un debate solo para que la otra persona no se sienta mal.', 'Enfocado en las personas', true, '#4B7C37'],
    ['G9', 'Siempre me aseguro de reconocer y validar públicamente las contribuciones de los demás.', 'Enfocado en las personas', false, '#4B7C37'],
    ['G10', 'Me resulta sumamente difícil expresar mis opiniones cuando percibo tensión en una reunión.', 'Introvertido', true, '#1E5AA8'],
    ['G11', 'Tiendo a confiar espontáneamente en la buena fe y las intenciones de las personas.', 'Enfocado en las personas', false, '#4B7C37'],
    ['G12', 'Llego a involucrarme de forma tan compasiva en los problemas ajenos que pierdo la objetividad.', 'Enfocado en las personas', true, '#4B7C37']
  ]
};

// Orden intercalado R1, A1, Y1, G1, R2… para no agrupar cuadrantes
const QUESTIONS = (() => {
  const keys = ['rojo', 'azul', 'amarillo', 'verde'], out = [];
  for (let i = 0; i < 13; i++) keys.forEach(k => {
    const q = BANK[k][i];
    if (q) out.push({ id: out.length + 1, style: k, code: q[0], text: q[1], aspect: q[2], negative: q[3], color: q[4], fg: q[4] === '#B6BE34' ? '#040404' : '#FFFFFF' });
  });
  return out;
})();

const INTRO = [
  'Este cuestionario te ayuda a identificar tu estilo de liderazgo académico.',
  'Desliza la tarjeta a la derecha si estás de acuerdo y a la izquierda si no. También puedes usar los botones.',
  'No hay respuestas correctas. Responde pensando en cómo actúas hoy, no en cómo te gustaría actuar.'
];

const pad = n => String(n).padStart(2, '0');
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const LS_KEY = 'maxwell_sesiones_v1';
const loadLocal = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch (e) { return []; } };
const saveLocal = l => { try { localStorage.setItem(LS_KEY, JSON.stringify(l)); } catch (e) {} };
const DARK_SCREENS = ['intro', 'countdown', 'quiz', 'reveal'];
const THRESHOLD = 100;
const clamp = v => Math.max(0, Math.min(1, v));

const ICON = {
  close: s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  back: (s, w = 2.6) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>`,
  next: s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>`,
  play: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg>',
  pause: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="5" height="16" rx="1.5"/><rect x="14" y="4" width="5" height="16" rx="1.5"/></svg>',
  check: (s, c = 'currentColor', w = 2.8) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`
};
const fourColors = (size, gap, r) => `
  <div style="width:${size}px;height:${size}px;flex:none;display:grid;grid-template-columns:1fr 1fr;gap:${gap}px" aria-hidden="true">
    <span style="background:#C62828;border-radius:${size}px ${r}px ${r}px ${r}px"></span>
    <span style="background:#F2A100;border-radius:${r}px ${size}px ${r}px ${r}px"></span>
    <span style="background:#2F6DB5;border-radius:${r}px ${r}px ${r}px ${size}px"></span>
    <span style="background:#2E8B57;border-radius:${r}px ${r}px ${size}px ${r}px"></span>
  </div>`;

// ---------- Estado ----------
const S = {
  screen: 'welcome', name: '', nameError: '', group: '', introStep: 0, count: 3,
  idx: 0, answers: [], exiting: 0, secs: 0, timerOn: false, paused: false, timedOut: false,
  detail: 0, pinVal: '', pinError: '', rows: [], panelGroup: 'TODOS', loading: false, remoteErr: false
};
let timeout = null, drag = null, rendered = null;
const view = document.getElementById('view');
const statusbar = document.getElementById('statusbar');
const themeMeta = document.querySelector('meta[name="theme-color"]');

function set(patch) { Object.assign(S, patch); render(); }

function go(screen) {
  clearTimeout(timeout);
  const patch = { screen, paused: false };
  if (screen === 'welcome') Object.assign(patch, { idx: 0, answers: [], secs: 0, timedOut: false, timerOn: false, introStep: 0, exiting: 0 });
  if (screen === 'quiz') Object.assign(patch, { timerOn: true, secs: 0, timedOut: false });
  set(patch);
  if (screen === 'countdown') tick(3);
  if (screen === 'profile') timeout = setTimeout(revealChart, 80);
}
function tick(n) {
  set({ count: n });
  timeout = setTimeout(() => (n > 0 ? tick(n - 1) : go('quiz')), n > 0 ? 800 : 650);
}

function record(q, agree) { return { style: q.style, code: q.code, agree, point: q.negative ? !agree : agree }; }

function answer(agree) {
  if (S.exiting || S.screen !== 'quiz' || S.paused) return;
  S.exiting = agree ? 1 : -1;
  drag = null;
  paintCard(true);
  const idx = S.idx;
  timeout = setTimeout(() => {
    if (S.screen !== 'quiz') return;
    const answers = [...S.answers, record(QUESTIONS[idx], agree)];
    const done = idx + 1 >= QUESTIONS.length;
    set({ answers, idx: done ? idx : idx + 1, exiting: 0, timerOn: !done, screen: done ? 'reveal' : 'quiz' });
    if (done) saveSession(answers, S.secs, false);
  }, 280);
}

function timeUp() {
  clearTimeout(timeout);
  let list = S.answers;
  if (S.exiting) list = [...list, record(QUESTIONS[S.idx], S.exiting > 0)];
  drag = null;
  set({ answers: list, secs: LIMIT, timerOn: false, timedOut: true, paused: false, exiting: 0, screen: 'reveal' });
  saveSession(list, LIMIT, true);
}

function scoresOf(answers) {
  const out = {};
  STYLES.forEach(s => {
    const a = answers.filter(x => x.style === s.key);
    out[s.key] = a.length ? Math.round(100 * a.filter(x => x.point).length / a.length) : 0;
  });
  return out;
}
const rank = sc => STYLES.map((s, i) => ({ ...s, i, pct: sc[s.key] })).sort((a, b) => b.pct - a.pct || a.i - b.i);

// ---------- Registro grupal ----------
function saveSession(answers, secs, timedOut) {
  if (!answers.length) return;
  const out = scoresOf(answers), r = rank(out);
  const rec = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), ts: new Date().toISOString(), group: S.group.trim().toUpperCase() || 'SIN GRUPO', top: r[0].name, bottom: r[3].name, ...out, answered: answers.length, secs, timedOut };
  saveLocal([...loadLocal(), { ...rec, synced: false }]);
  push(rec);
}
function push(rec) {
  const url = CFG.sheetsUrl;
  if (!url) return Promise.resolve();
  const { synced, ...body } = rec;
  return fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) }).then(() => {
    saveLocal(loadLocal().map(r => r.id === rec.id ? { ...r, synced: true } : r));
    S.rows = S.rows.map(r => r.id === rec.id ? { ...r, synced: true } : r);
    if (S.screen === 'panel') render();
  }).catch(() => {});
}
function loadPanel() {
  const url = CFG.sheetsUrl;
  set({ rows: loadLocal(), loading: !!url, remoteErr: false });
  if (!url) return;
  fetch(url + (url.includes('?') ? '&' : '?') + 'pin=' + encodeURIComponent(S.pinVal.trim())).then(r => r.json()).then(remote => {
    if (!Array.isArray(remote)) throw new Error('formato');
    const map = new Map(loadLocal().map(r => [r.id, r]));
    remote.forEach(r => map.set(String(r.id), { ...r, id: String(r.id), rojo: +r.rojo, azul: +r.azul, amarillo: +r.amarillo, verde: +r.verde, synced: true }));
    set({ rows: [...map.values()], loading: false });
  }).catch(() => set({ loading: false, remoteErr: true }));
}
function csv(rows) {
  const q = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const head = ['Fecha', 'Grupo', 'Estilo más alto', 'Estilo más bajo', 'Rojo Directivo %', 'Azul Analítico %', 'Amarillo Innovador %', 'Verde Empoderador %', 'Afirmaciones respondidas', 'Segundos', 'Tiempo agotado'];
  const lines = rows.map(r => [r.ts, r.group, r.top, r.bottom, r.rojo, r.azul, r.amarillo, r.verde, r.answered, r.secs, r.timedOut === true || r.timedOut === 'true' ? 'Sí' : 'No'].map(q).join(','));
  return '﻿' + [head.map(q).join(','), ...lines].join('\r\n');
}
const panelRows = () => S.rows.filter(r => S.panelGroup === 'TODOS' || r.group === S.panelGroup);
function downloadCsv() {
  const rs = panelRows().slice().sort((a, b) => String(a.ts).localeCompare(String(b.ts)));
  const blob = new Blob([csv(rs)], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'maxwell-coach-' + (S.panelGroup === 'TODOS' ? 'todos' : S.panelGroup.toLowerCase().replace(/[^a-z0-9]+/g, '-')) + '-' + new Date().toISOString().slice(0, 10) + '.csv';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// ---------- Pantallas ----------
const displayName = () => S.name.trim() || 'Tú';

function welcomeHTML() {
  return `
  <div class="scroll" style="display:flex;flex-direction:column;padding:12px 24px 28px;gap:24px;background:var(--white)">
    <div style="display:flex;align-items:center;justify-content:space-between">
      <div style="display:flex;flex-direction:column;gap:2px">
        <span style="font:800 18px/1.1 var(--font-sans);letter-spacing:-0.02em;color:var(--rich-black)">Maxwell Coach</span>
        <span style="font:700 10px var(--font-sans);letter-spacing:.12em;text-transform:uppercase;color:var(--danger)">UP QROO</span>
      </div>
      <span class="badge">Liderazgo académico</span>
    </div>
    <div style="background:var(--rich-black);border-radius:28px;padding:24px;display:flex;flex-direction:column;gap:20px;color:var(--white)">
      <div style="display:flex;align-items:center;gap:18px">
        ${fourColors(88, 4, 6)}
        <div style="display:flex;flex-direction:column;gap:6px">
          <span class="eyebrow" style="color:var(--orange)">Lectura rápida</span>
          <span style="font:800 22px/1.15 var(--font-sans);letter-spacing:-0.02em">Tu estilo de liderazgo en 4 colores</span>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 12px">
        ${STYLES.map(s => `<div style="display:flex;align-items:center;gap:8px;font:600 13px var(--font-sans);color:var(--gray-200)"><span style="width:10px;height:10px;border-radius:999px;flex:none;background:${s.color}"></span>${s.name}</div>`).join('')}
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:10px">
      <h1 style="font:800 30px/1.12 var(--font-sans);letter-spacing:-0.02em;color:var(--rich-black);text-wrap:pretty">Descubre cómo <span style="color:var(--orange)">lideras</span> en tu comunidad académica.</h1>
      <p style="font:500 16px/1.55 var(--font-sans);color:var(--text-muted);text-wrap:pretty">Son ${QUESTIONS.length} afirmaciones. Calculamos que te tomará menos de 5 minutos.</p>
    </div>
    <form data-form="start" style="margin-top:auto;display:flex;flex-direction:column;gap:16px" novalidate>
      <label class="field${S.nameError ? ' has-error' : ''}">
        <span>Confirma tu nombre</span>
        <input data-model="name" value="${esc(S.name)}" placeholder="Tu nombre" autocomplete="given-name" maxlength="60">
        ${S.nameError ? `<span class="err">${S.nameError}</span>` : ''}
      </label>
      <label class="field">
        <span>Código de grupo (opcional)</span>
        <input data-model="group" value="${esc(S.group)}" placeholder="Ej. DOC-2026" autocapitalize="characters" maxlength="40">
      </label>
      <button type="submit" class="btn btn-lg btn-guinda btn-full">Comenzar</button>
      <button type="button" class="link-btn" data-act="openPin">Panel del facilitador</button>
    </form>
  </div>`;
}

function darkHTML() {
  return `
  <div style="display:flex;flex-direction:column;background:var(--rich-black);color:var(--white);position:relative">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 20px 12px;z-index:5">
      <button class="icon-btn dark" data-act="exit" aria-label="Salir">${ICON.close(18)}</button>
      <span data-ref="header" style="font:700 15px var(--font-sans);letter-spacing:.02em;font-variant-numeric:tabular-nums"></span>
      <button class="icon-btn dark" data-act="togglePause" data-ref="pauseBtn" aria-label="Pausa"></button>
    </div>
    <div style="margin:0 24px;height:4px;border-radius:999px;background:var(--raisin-black);overflow:hidden">
      <div data-ref="progress" style="height:100%;width:0;background:var(--orange);border-radius:999px;transition:width 250ms var(--ease)"></div>
    </div>
    <div data-ref="stage" style="flex:1;min-height:0;position:relative;display:flex;align-items:center;justify-content:center;padding:0 24px"></div>
    <div data-ref="controls" style="display:flex;align-items:flex-end;justify-content:space-between;padding:8px 32px 34px;transition:opacity 250ms var(--ease)">
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
        <button class="answer-btn no" data-act="disagree" data-ref="noBtn" aria-label="En desacuerdo"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
        <span style="font:700 13px var(--font-sans);color:var(--gray-300)">En desacuerdo</span>
      </div>
      <span style="font:600 12px var(--font-sans);color:var(--gray-600);padding-bottom:30px" aria-hidden="true">← →</span>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
        <button class="answer-btn yes" data-act="agree" data-ref="yesBtn" aria-label="De acuerdo">${ICON.check(28, 'currentColor', 2.8)}</button>
        <span style="font:700 13px var(--font-sans);color:var(--gray-300)">De acuerdo</span>
      </div>
    </div>
  </div>`;
}

function stageHTML() {
  const sc = S.screen;
  let html = '';
  if (sc === 'intro') {
    html = `
    <div style="width:100%;background:var(--white);color:var(--rich-black);border-radius:20px;overflow:hidden;box-shadow:var(--shadow-lg)">
      <div style="padding:28px 24px 24px;display:flex;flex-direction:column;gap:14px">
        <span class="eyebrow" style="color:var(--orange)">Paso ${S.introStep + 1} de 3</span>
        <p style="font:800 26px/1.2 var(--font-sans);letter-spacing:-0.02em;text-wrap:pretty">${INTRO[S.introStep]}</p>
      </div>
      <div style="border-top:1px solid var(--gray-200);display:flex;align-items:center;justify-content:space-between;padding:14px 16px 14px 24px">
        <div style="display:flex;gap:6px">${INTRO.map((_, i) => `<span style="width:${i === S.introStep ? 22 : 8}px;height:8px;border-radius:999px;background:${i === S.introStep ? '#FF5900' : '#CFCFCF'}"></span>`).join('')}</div>
        <button class="btn btn-ghost" data-act="nextIntro">${S.introStep === 2 ? '¡Vamos!' : 'Continuar'}</button>
      </div>
    </div>`;
  } else if (sc === 'countdown') {
    html = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:12px">
      <span style="font:700 12px var(--font-sans);letter-spacing:.12em;text-transform:uppercase;color:var(--spanish-gray)">Prepárate</span>
      <div style="width:180px;height:180px;border-radius:999px;border:3px solid var(--orange);display:flex;align-items:center;justify-content:center">
        <span style="font:800 ${S.count > 0 ? 88 : 36}px/1 var(--font-sans);letter-spacing:-0.03em;color:var(--white)">${S.count > 0 ? S.count : '¡Vamos!'}</span>
      </div>
    </div>`;
  } else if (sc === 'quiz') {
    const q = QUESTIONS[S.idx], nq = QUESTIONS[S.idx + 1];
    const cc = CFG.colorCards;
    const bg = cc ? q.color : '#FFFFFF', fg = cc ? q.fg : '#040404';
    const eyebrow = cc ? (q.fg === '#FFFFFF' ? 'rgba(255,255,255,.8)' : 'rgba(4,4,4,.65)') : '#9C9C9C';
    html = `
    <div style="position:relative;width:100%;height:min(400px,100%)">
      ${nq ? `<div style="position:absolute;inset:0;border-radius:28px;background:${cc ? nq.color : '#FFFFFF'};transform:translateY(18px) scale(.92);opacity:.55;padding:32px 28px;display:flex;align-items:center;overflow:hidden">
        <p style="font:800 26px/1.22 var(--font-sans);letter-spacing:-0.02em;color:${cc ? nq.fg : '#040404'};opacity:.35">${nq.text}</p>
      </div>` : ''}
      <div class="swipe-card" data-ref="card" style="background:${bg};color:${fg}" role="group" aria-label="Afirmación ${S.idx + 1} de ${QUESTIONS.length}">
        <span class="eyebrow" style="color:${eyebrow}">Afirmación ${S.idx + 1} de ${QUESTIONS.length}</span>
        <p style="font:800 28px/1.22 var(--font-sans);letter-spacing:-0.02em;text-wrap:pretty;pointer-events:none">${q.text}</p>
        <span style="font:600 13px var(--font-sans);color:${eyebrow}">Desliza o usa los botones</span>
        <div class="stamp" data-ref="stampYes" style="left:24px;transform:rotate(-12deg);border:3px solid var(--orange);color:var(--orange)">De acuerdo</div>
        <div class="stamp" data-ref="stampNo" style="right:24px;transform:rotate(12deg);border:3px solid var(--raisin-black);color:var(--raisin-black)">En desacuerdo</div>
      </div>
    </div>`;
  } else if (sc === 'reveal') {
    const n = S.answers.length, m = Math.floor(S.secs / 60), s = S.secs % 60;
    const text = S.timedOut
      ? `Se acabaron los ${Math.round(LIMIT / 60)} minutos. Respondiste ${n} de ${QUESTIONS.length} afirmaciones y tu perfil se calculó con ellas.`
      : `Completaste tu lectura rápida en ${m ? m + ' min ' + s + ' s' : s + ' segundos'}. Tu perfil de liderazgo está listo.`;
    html = `
    <div style="width:100%;display:flex;flex-direction:column;align-items:center;gap:28px;text-align:center">
      ${fourColors(120, 5, 8)}
      <div style="display:flex;flex-direction:column;gap:10px">
        <h2 style="font:800 30px/1.15 var(--font-sans);letter-spacing:-0.02em;color:var(--white)">¡Listo, ${esc(displayName())}!</h2>
        <p style="font:500 17px/1.5 var(--font-sans);color:var(--gray-300);text-wrap:pretty">${text}</p>
      </div>
      <button class="btn btn-lg btn-primary btn-full" data-act="toProfile">Ver mi perfil</button>
    </div>`;
  }
  if (S.paused) html += `
    <div style="position:absolute;inset:0;background:var(--rich-black);display:flex;align-items:center;justify-content:center;padding:24px;z-index:10">
      <div style="width:100%;background:var(--raisin-black);border-radius:20px;padding:28px 24px;display:flex;flex-direction:column;gap:16px;align-items:center;text-align:center">
        <span style="font:800 24px var(--font-sans);letter-spacing:-0.02em">Lectura en pausa</span>
        <span style="font:500 15px/1.5 var(--font-sans);color:var(--gray-300)">Tus respuestas se guardaron. Continúa cuando estés listo.</span>
        <button class="btn btn-primary" data-act="togglePause">Reanudar</button>
      </div>
    </div>`;
  return html;
}

function headerText() {
  const rem = Math.max(0, LIMIT - S.secs);
  return (CFG.showTimer ? `${pad(Math.floor(rem / 60))}:${pad(rem % 60)} · ` : '') + displayName();
}

function wedgePath(a1, a2, r) {
  const rad = a => a * Math.PI / 180, p = a => `${(150 + r * Math.cos(rad(a))).toFixed(1)} ${(150 + r * Math.sin(rad(a))).toFixed(1)}`;
  return `M150 150 L${p(a1)} A${r} ${r} 0 0 1 ${p(a2)} Z`;
}

function profileHTML() {
  const sc = scoresOf(S.answers), ranked = rank(sc);
  const none = !S.answers.length;
  const top = none ? { name: 'sin determinar', ink: '#9C9C9C', tagline: 'No respondiste ninguna afirmación, así que no hay resultados que calcular.' } : ranked[0];
  const second = ranked[1];
  const angles = [180, 270, 0, 90];
  return `
  <div class="scroll" style="background:var(--white);display:flex;flex-direction:column">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 24px 16px;border-bottom:1px solid var(--gray-200)">
      <span style="font:800 17px var(--font-sans);letter-spacing:-0.02em;color:var(--rich-black)">Mi perfil de liderazgo</span>
      <button class="btn btn-sm btn-outline" data-act="restart">Repetir</button>
    </div>
    <div style="padding:24px 24px 8px;display:flex;flex-direction:column;gap:10px">
      <span class="eyebrow" style="color:var(--orange)">${esc(displayName())} · Lectura rápida</span>
      <h2 style="font:800 28px/1.15 var(--font-sans);letter-spacing:-0.02em;color:var(--rich-black);text-wrap:pretty">Tu estilo predominante es <span style="color:${top.ink}">${top.name}</span></h2>
      <p style="font:500 15px/1.55 var(--font-sans);color:var(--text-muted);text-wrap:pretty">${top.tagline} ${!none && second.pct > 0 ? `También muestras rasgos de ${second.name} (${second.pct}%).` : ''}</p>
    </div>
    <div style="position:relative;width:310px;max-width:calc(100% - 32px);aspect-ratio:1;margin:12px auto 4px;flex:none">
      <svg viewBox="0 0 300 300" style="display:block;width:100%;height:100%" role="img" aria-label="Gráfica de tus cuatro estilos">
        <circle cx="150" cy="150" r="128" fill="none" stroke="#E6E6E6" stroke-width="1"/>
        <circle cx="150" cy="150" r="88" fill="none" stroke="#E6E6E6" stroke-width="1"/>
        <circle cx="150" cy="150" r="48" fill="none" stroke="#E6E6E6" stroke-width="1"/>
        <line x1="150" y1="14" x2="150" y2="286" stroke="#E6E6E6" stroke-width="1"/>
        <line x1="14" y1="150" x2="286" y2="150" stroke="#E6E6E6" stroke-width="1"/>
        <g data-ref="chart" style="transform:scale(.05);transform-origin:150px 150px;transition:transform 900ms cubic-bezier(.2,.7,.2,1)">
          ${STYLES.map((s, i) => `<path class="wedge" data-act="open" data-i="${i}" d="${wedgePath(angles[i] + 1.5, angles[i] + 88.5, 22 + (sc[s.key] / 100) * 106)}" fill="${s.color}"><title>${s.name}: ${sc[s.key]}%</title></path>`).join('')}
        </g>
        <circle cx="150" cy="150" r="5" fill="#FFFFFF"/>
      </svg>
      ${STYLES.map((s, i) => {
        const pos = [i < 2 ? 'top:0' : 'bottom:0', i === 0 || i === 3 ? 'left:0' : 'right:0'].join(';');
        return `<button data-act="open" data-i="${i}" style="position:absolute;${pos};border:0;background:transparent;padding:0;display:flex;flex-direction:column;align-items:${i === 0 || i === 3 ? 'flex-start' : 'flex-end'};cursor:pointer">
          <span style="font:800 18px/1 var(--font-sans);color:${s.ink}">${sc[s.key]}%</span>
          <span style="font:700 10px var(--font-sans);letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted)">${s.short}</span>
        </button>`;
      }).join('')}
    </div>
    <p style="margin:0 0 8px;text-align:center;font:600 13px var(--font-sans);color:var(--spanish-gray)">Toca un estilo para explorarlo</p>
    <div style="padding:8px 24px 32px;display:flex;flex-direction:column">
      ${ranked.map(r => `
      <button class="style-row" data-act="open" data-i="${r.i}">
        <span style="width:14px;height:14px;border-radius:999px;background:${r.color}"></span>
        <span style="display:flex;flex-direction:column;gap:8px;min-width:0">
          <span style="font:700 15px var(--font-sans);color:var(--rich-black)">${r.name}</span>
          <span style="height:6px;border-radius:999px;background:var(--gray-100);overflow:hidden;display:block"><span data-bar="${r.pct}" style="display:block;height:100%;width:0;background:${r.color};border-radius:999px;transition:width 900ms cubic-bezier(.2,.7,.2,1)"></span></span>
        </span>
        <span style="font:800 16px var(--font-sans);color:var(--rich-black);text-align:right;font-variant-numeric:tabular-nums">${r.pct}%</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9C9C9C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
      </button>`).join('')}
    </div>
    <div style="padding:0 24px 32px;display:flex;flex-direction:column;gap:10px;align-items:center">
      <button class="btn btn-lg btn-guinda btn-full" data-act="printPdf">Descargar resultados en PDF</button>
      <span style="font:500 13px/1.4 var(--font-sans);color:var(--text-muted);text-align:center">Incluye tu estilo más alto y tu estilo más bajo.</span>
    </div>
  </div>`;
}

function revealChart() {
  const g = view.querySelector('[data-ref="chart"]');
  if (g) g.style.transform = 'scale(1)';
  view.querySelectorAll('[data-bar]').forEach(b => { b.style.width = b.dataset.bar + '%'; });
}

function detailHTML() {
  const d = STYLES[S.detail], sc = scoresOf(S.answers);
  return `
  <div class="scroll" style="background:${d.color};color:${d.fg};display:flex;flex-direction:column">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 20px 8px">
      <button class="icon-btn" data-act="toProfile" aria-label="Volver" style="background:${d.chip};color:${d.fg}">${ICON.back(20)}</button>
      <span class="eyebrow">Estilo ${S.detail + 1} de 4</span>
      <div style="display:flex;gap:8px">
        <button class="icon-btn" data-act="prevStyle" aria-label="Anterior" style="background:${d.chip};color:${d.fg}">${ICON.back(18)}</button>
        <button class="icon-btn" data-act="nextStyle" aria-label="Siguiente" style="background:${d.chip};color:${d.fg}">${ICON.next(18)}</button>
      </div>
    </div>
    <div style="padding:20px 24px 28px;display:flex;flex-direction:column;gap:12px">
      <span style="font:800 72px/1 var(--font-sans);letter-spacing:-0.04em">${sc[d.key]}%</span>
      <h2 style="font:800 32px/1.1 var(--font-sans);letter-spacing:-0.02em;color:inherit">${d.name}</h2>
      <p style="font:600 17px/1.5 var(--font-sans);text-wrap:pretty">${esc(d.summary(displayName()))}</p>
    </div>
    <div style="flex:1;background:var(--white);color:var(--text-body);border-radius:28px 28px 0 0;padding:28px 24px 32px;display:flex;flex-direction:column;gap:24px">
      <div style="display:flex;flex-direction:column;gap:12px">
        <span class="eyebrow" style="color:var(--orange)">Fortalezas</span>
        ${d.strengths.map(t => `<div style="display:flex;gap:12px;align-items:flex-start;font:600 15px/1.45 var(--font-sans);color:var(--rich-black)"><span style="margin-top:1px;display:flex">${ICON.check(18, '#FF5900')}</span><span>${t}</span></div>`).join('')}
      </div>
      <div style="height:1px;background:var(--gray-200)"></div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <span class="eyebrow" style="color:var(--orange)">Puntos ciegos</span>
        ${d.blind.map(t => `<div style="display:flex;gap:12px;align-items:flex-start;font:500 15px/1.45 var(--font-sans);color:var(--text-body)"><span style="width:8px;height:8px;border-radius:999px;border:2px solid var(--spanish-gray);flex:none;margin:6px 5px 0"></span><span>${t}</span></div>`).join('')}
      </div>
      <div style="background:var(--orange-50);border-radius:20px;padding:20px;display:flex;flex-direction:column;gap:8px">
        <span class="eyebrow" style="color:var(--orange-700)">Consejo de tu coach</span>
        <p style="font:600 16px/1.5 var(--font-sans);color:var(--rich-black);text-wrap:pretty">${d.tip}</p>
      </div>
      <div style="display:flex;justify-content:center;gap:8px">
        ${STYLES.map((s, i) => `<button data-act="open" data-i="${i}" aria-label="${s.name}" style="width:${i === S.detail ? 28 : 10}px;height:10px;border-radius:999px;border:0;padding:0;background:${s.color};opacity:${i === S.detail ? 1 : .35};cursor:pointer;transition:all 250ms var(--ease)"></button>`).join('')}
      </div>
    </div>
  </div>`;
}

function pinHTML() {
  return `
  <div class="scroll" style="background:var(--white);display:flex;flex-direction:column;padding:12px 24px 28px;gap:24px">
    <button class="icon-btn light" data-act="closePanel" aria-label="Volver">${ICON.back(18, 2.5)}</button>
    <div style="display:flex;flex-direction:column;gap:10px">
      <span class="eyebrow" style="color:var(--guinda)">Facilitador</span>
      <h2 style="font:800 30px/1.12 var(--font-sans);letter-spacing:-0.02em;color:var(--rich-black)">Panel del grupo</h2>
      <p style="font:500 16px/1.55 var(--font-sans);color:var(--text-muted)">Escribe el PIN para ver los resultados del grupo.</p>
    </div>
    <form data-form="pin" style="margin-top:auto;display:flex;flex-direction:column;gap:16px" novalidate>
      <label class="field${S.pinError ? ' has-error' : ''}">
        <span>PIN</span>
        <input data-model="pinVal" type="password" inputmode="numeric" autocomplete="off" value="${esc(S.pinVal)}">
        ${S.pinError ? `<span class="err">${S.pinError}</span>` : ''}
      </label>
      <button type="submit" class="btn btn-lg btn-guinda btn-full">Entrar</button>
    </form>
  </div>`;
}

function panelHTML() {
  const all = S.rows;
  const groups = ['TODOS', ...[...new Set(all.map(r => r.group))].sort()];
  if (!groups.includes(S.panelGroup)) S.panelGroup = 'TODOS';
  const rs = panelRows(), n = rs.length;
  const avg = k => n ? Math.round(rs.reduce((a, r) => a + (+r[k] || 0), 0) / n) : 0;
  const shortOf = nm => (STYLES.find(x => x.name === nm) || {}).short || nm;
  const fmt = ts => { const dt = new Date(ts); return isNaN(dt) ? '' : dt.toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); };
  const last = [...rs].sort((a, b) => String(b.ts).localeCompare(String(a.ts))).slice(0, 6);
  const pending = CFG.sheetsUrl ? all.filter(r => r.synced === false).length : 0;
  const source = !CFG.sheetsUrl ? 'Solo este dispositivo. Agrega la URL de la hoja de Google en config.js para reunir a todos.'
    : S.loading ? 'Actualizando desde la hoja de Google…'
    : S.remoteErr ? 'No se pudo leer la hoja. Se muestran los datos de este dispositivo.'
    : 'Hoja de Google y este dispositivo';
  const grid = 'display:grid;grid-template-columns:minmax(0,1fr) 44px 44px 44px;gap:6px';
  return `
  <div class="scroll" style="background:var(--white);display:flex;flex-direction:column">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 24px 16px;border-bottom:1px solid var(--gray-200)">
      <span style="font:800 17px var(--font-sans);letter-spacing:-0.02em;color:var(--rich-black)">Panel del grupo</span>
      <button class="btn btn-sm btn-outline" data-act="closePanel">Salir</button>
    </div>
    <div style="padding:20px 24px 28px;display:flex;flex-direction:column;gap:22px">
      <div style="display:flex;flex-direction:column;gap:8px">
        <label class="eyebrow" for="mx-group" style="color:var(--guinda)">Grupo</label>
        <select id="mx-group" class="group-select" data-change="panelGroup">
          ${groups.map(g => `<option value="${esc(g)}"${g === S.panelGroup ? ' selected' : ''}>${esc(g)}</option>`).join('')}
        </select>
        <span style="font:500 12px/1.4 var(--font-sans);color:var(--text-muted)">${source}</span>
      </div>
      <div style="display:flex;align-items:baseline;gap:10px">
        <span style="font:800 56px/1 var(--font-sans);letter-spacing:-0.04em;color:var(--rich-black)">${n}</span>
        <span style="font:600 15px var(--font-sans);color:var(--text-muted)">${n === 1 ? 'participante' : 'participantes'}</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px">
        <div style="${grid};font:700 10px var(--font-sans);letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted)">
          <span>Estilo</span><span style="text-align:right">Prom.</span><span style="text-align:right">Alto</span><span style="text-align:right">Bajo</span>
        </div>
        ${STYLES.map(s => {
          const a = avg(s.key);
          return `
        <div style="${grid};align-items:center">
          <div style="display:flex;flex-direction:column;gap:6px">
            <span style="display:flex;align-items:center;gap:8px;font:700 13px var(--font-sans);color:var(--rich-black)"><span style="width:10px;height:10px;border-radius:999px;flex:none;background:${s.color}"></span>${s.name}</span>
            <span style="display:block;height:6px;border-radius:999px;background:var(--gray-100);overflow:hidden"><span style="display:block;height:100%;width:${a}%;background:${s.color}"></span></span>
          </div>
          <span style="font:800 15px var(--font-sans);text-align:right;font-variant-numeric:tabular-nums">${a}%</span>
          <span style="font:700 15px var(--font-sans);text-align:right;font-variant-numeric:tabular-nums">${rs.filter(r => r.top === s.name).length}</span>
          <span style="font:700 15px var(--font-sans);text-align:right;font-variant-numeric:tabular-nums">${rs.filter(r => r.bottom === s.name).length}</span>
        </div>`;
        }).join('')}
        <span style="font:500 12px/1.4 var(--font-sans);color:var(--text-muted)">Prom. es el porcentaje medio del grupo. Alto y Bajo cuentan cuántas personas lo tienen como estilo más alto o más bajo.</span>
      </div>
      ${n ? `
      <div style="display:flex;flex-direction:column;gap:10px">
        <span class="eyebrow" style="color:var(--guinda)">Últimas sesiones</span>
        ${last.map(l => `
        <div style="display:flex;flex-direction:column;gap:2px;padding-bottom:10px;border-bottom:1px solid var(--gray-200)">
          <span style="font:500 12px var(--font-sans);color:var(--text-muted)">${fmt(l.ts)} · ${esc(l.group)}</span>
          <span style="font:600 14px var(--font-sans);color:var(--rich-black)">Alto: ${esc(shortOf(l.top))} · Bajo: ${esc(shortOf(l.bottom))}</span>
        </div>`).join('')}
      </div>` : ''}
      <div style="display:flex;flex-direction:column;gap:10px">
        <button class="btn btn-lg btn-guinda btn-full" data-act="downloadCsv">Descargar CSV</button>
        <button class="btn btn-outline btn-full" data-act="refresh">Actualizar</button>
        ${pending ? `<button class="btn btn-outline btn-full" data-act="resend">Reenviar ${pending} pendiente${pending === 1 ? '' : 's'} a la hoja</button>` : ''}
      </div>
    </div>
  </div>`;
}

function reportHTML() {
  const sc = scoresOf(S.answers), ranked = rank(sc), nm = displayName();
  const blocks = [[ranked[0], 'Estilo más alto', ranked[0].summary(nm)], [ranked[3], 'Estilo más bajo', ranked[3].tagline + ' Es el estilo que menos aparece en tus respuestas.']];
  const lbl = 'font:700 10px var(--font-sans);letter-spacing:.12em;text-transform:uppercase;color:#800020';
  return `
  <div style="display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:14px;border-bottom:2px solid #040404">
    <div style="display:flex;flex-direction:column;gap:4px">
      <span style="${lbl}">Maxwell Coach · UP QROO</span>
      <span style="font:800 26px/1.1 var(--font-sans);letter-spacing:-0.02em">Reporte de liderazgo académico</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:2px;text-align:right">
      <span style="font:800 16px var(--font-sans)">${esc(nm)}</span>
      <span style="font:500 12px var(--font-sans);color:#5a5a5a">${new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;padding:16px 0 18px">
    ${ranked.map(b => `
    <div style="display:flex;flex-direction:column;gap:6px">
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:6px">
        <span style="font:700 11px var(--font-sans)">${b.name}</span>
        <span style="font:800 14px var(--font-sans)">${b.pct}%</span>
      </div>
      <span style="display:block;height:6px;border-radius:999px;background:#E6E6E6;overflow:hidden"><span style="display:block;height:100%;width:${b.pct}%;background:${b.color}"></span></span>
    </div>`).join('')}
  </div>
  <div style="display:flex;flex-direction:column;gap:18px">
    ${blocks.map(([k, label, text]) => `
    <div style="border:1px solid #E6E6E6;border-radius:18px;overflow:hidden;break-inside:avoid;page-break-inside:avoid">
      <div style="background:${k.color};color:${k.fg};padding:18px 22px;display:flex;align-items:center;justify-content:space-between;gap:20px">
        <div style="display:flex;flex-direction:column;gap:4px">
          <span style="font:700 10px var(--font-sans);letter-spacing:.12em;text-transform:uppercase">${label}</span>
          <span style="font:800 24px/1.1 var(--font-sans);letter-spacing:-0.02em">${k.name}</span>
        </div>
        <span style="font:800 44px/1 var(--font-sans);letter-spacing:-0.03em">${k.pct}%</span>
      </div>
      <div style="padding:18px 22px 20px;display:flex;flex-direction:column;gap:16px">
        <p style="font:600 13px/1.5 var(--font-sans)">${esc(text)}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
          <div style="display:flex;flex-direction:column;gap:8px">
            <span style="${lbl}">Fortalezas</span>
            ${k.strengths.map(t => `<span style="font:500 12.5px/1.4 var(--font-sans)">${t}</span>`).join('')}
          </div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <span style="${lbl}">Puntos ciegos</span>
            ${k.blind.map(t => `<span style="font:500 12.5px/1.4 var(--font-sans)">${t}</span>`).join('')}
          </div>
        </div>
        <div style="background:#FFF1EA;border-radius:12px;padding:12px 16px;display:flex;flex-direction:column;gap:4px">
          <span style="${lbl}">Consejo de tu coach</span>
          <span style="font:600 13px/1.45 var(--font-sans)">${k.tip}</span>
        </div>
      </div>
    </div>`).join('')}
  </div>`;
}

// ---------- Render ----------
function chrome() {
  const dark = DARK_SCREENS.includes(S.screen);
  const bg = S.screen === 'detail' ? STYLES[S.detail].color : dark ? '#040404' : '#FFFFFF';
  const fg = S.screen === 'detail' ? STYLES[S.detail].fg : dark ? '#FFFFFF' : '#040404';
  statusbar.style.background = bg;
  statusbar.style.color = fg;
  if (themeMeta) themeMeta.setAttribute('content', bg);
  document.body.style.background = window.matchMedia('(max-width:500px)').matches ? bg : '';
}

function render() {
  chrome();
  const dark = DARK_SCREENS.includes(S.screen);
  const kind = dark ? 'dark' : S.screen;
  const keep = kind === rendered && (kind === 'dark' || kind === 'panel');
  if (!keep) {
    const fresh = kind !== rendered;
    rendered = kind;
    view.innerHTML = { welcome: welcomeHTML, dark: darkHTML, profile: profileHTML, detail: detailHTML, pin: pinHTML, panel: panelHTML }[kind]();
    if (fresh) view.firstElementChild.scrollTop = 0;
    if (kind === 'welcome' && S.nameError) view.querySelector('[data-model="name"]').focus();
    if (kind === 'pin') view.querySelector('[data-model="pinVal"]').focus();
    if (kind === 'profile') document.getElementById('mx-report').innerHTML = reportHTML();
  } else if (kind === 'panel') {
    const sc = view.firstElementChild.scrollTop;
    view.innerHTML = panelHTML();
    view.firstElementChild.scrollTop = sc;
  }
  if (dark) renderDark();
}

let lastStage = '';
function renderDark() {
  const ref = n => view.querySelector(`[data-ref="${n}"]`);
  ref('header').textContent = headerText();
  ref('pauseBtn').innerHTML = S.paused ? ICON.play : ICON.pause;
  ref('pauseBtn').style.opacity = S.screen === 'quiz' ? 1 : .35;
  ref('progress').style.width = (S.screen === 'quiz' ? (S.idx / QUESTIONS.length) * 100 : S.screen === 'reveal' ? 100 : 0) + '%';
  ref('controls').style.opacity = S.screen === 'quiz' ? 1 : S.screen === 'reveal' ? 0 : .35;
  ref('controls').style.pointerEvents = S.screen === 'reveal' ? 'none' : '';
  const html = stageHTML();
  if (html !== lastStage || !ref('stage').firstElementChild) { ref('stage').innerHTML = html; lastStage = html; }
  paintCard(false);
}

// Mueve la tarjeta y los sellos sin volver a dibujar la pantalla
function paintCard(exit) {
  const card = view.querySelector('[data-ref="card"]');
  const yes = view.querySelector('[data-ref="yesBtn"]'), no = view.querySelector('[data-ref="noBtn"]');
  const dx = drag ? drag.dx : 0, dy = drag ? drag.dy : 0;
  const live = S.exiting ? S.exiting : dx / THRESHOLD;
  if (card) {
    card.classList.toggle('dragging', !!drag && !exit);
    card.style.transform = S.exiting
      ? `translate(${S.exiting * 560}px, ${dy * .3}px) rotate(${S.exiting * 22}deg)`
      : `translate(${dx}px, ${dy * .3}px) rotate(${dx * .06}deg)`;
    card.querySelector('[data-ref="stampYes"]').style.opacity = clamp(live);
    card.querySelector('[data-ref="stampNo"]').style.opacity = clamp(-live);
  }
  if (yes) yes.style.transform = `scale(${1 + clamp(live) * .14})`;
  if (no) no.style.transform = `scale(${1 + clamp(-live) * .14})`;
}

// ---------- Eventos ----------
const actions = {
  openPin: () => set({ screen: 'pin', pinVal: '', pinError: '' }),
  exit: () => go('welcome'),
  togglePause: () => { if (S.screen === 'quiz') set({ paused: !S.paused }); },
  nextIntro: () => (S.introStep < 2 ? set({ introStep: S.introStep + 1 }) : go('countdown')),
  agree: () => answer(true),
  disagree: () => answer(false),
  toProfile: () => go('profile'),
  restart: () => go('welcome'),
  open: el => set({ detail: +el.dataset.i, screen: 'detail' }),
  prevStyle: () => set({ detail: (S.detail + 3) % 4 }),
  nextStyle: () => set({ detail: (S.detail + 1) % 4 }),
  printPdf: () => {
    document.getElementById('mx-report').innerHTML = reportHTML();
    const t = document.title;
    document.title = 'Maxwell Coach - ' + (S.name.trim() || 'Resultados');
    window.print();
    document.title = t;
  },
  closePanel: () => go('welcome'),
  downloadCsv,
  refresh: loadPanel,
  resend: () => Promise.all(S.rows.filter(r => r.synced === false).map(push))
};

view.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el || !view.contains(el)) return;
  if (el.closest('[data-ref="controls"]') && S.screen !== 'quiz') return;
  actions[el.dataset.act](el);
});

view.addEventListener('submit', e => {
  e.preventDefault();
  if (e.target.dataset.form === 'start') {
    if (S.name.trim()) go('intro'); else set({ nameError: 'Escribe tu nombre para continuar' });
  } else if (e.target.dataset.form === 'pin') {
    if (S.pinVal.trim() !== String(CFG.facilitatorPin)) return set({ pinError: 'PIN incorrecto' });
    set({ screen: 'panel', panelGroup: 'TODOS' });
    loadPanel();
  }
});

view.addEventListener('input', e => {
  const key = e.target.dataset.model;
  if (!key) return;
  S[key] = e.target.value;
  const errKey = key === 'name' ? 'nameError' : key === 'pinVal' ? 'pinError' : null;
  if (errKey && S[errKey]) {
    S[errKey] = '';
    const field = e.target.closest('.field');
    field.classList.remove('has-error');
    const err = field.querySelector('.err');
    if (err) err.remove();
  }
});

view.addEventListener('change', e => {
  if (e.target.dataset.change === 'panelGroup') set({ panelGroup: e.target.value });
});

view.addEventListener('pointerdown', e => {
  const card = e.target.closest('[data-ref="card"]');
  if (!card || S.exiting || S.paused || S.screen !== 'quiz') return;
  card.setPointerCapture(e.pointerId);
  drag = { x: e.clientX, y: e.clientY, dx: 0, dy: 0 };
  paintCard(false);
});
view.addEventListener('pointermove', e => {
  if (!drag) return;
  drag.dx = e.clientX - drag.x;
  drag.dy = e.clientY - drag.y;
  paintCard(false);
});
const endDrag = () => {
  if (!drag) return;
  const dx = drag.dx;
  if (Math.abs(dx) > THRESHOLD) answer(dx > 0);
  else { drag = null; paintCard(false); }
};
view.addEventListener('pointerup', endDrag);
view.addEventListener('pointercancel', endDrag);

window.addEventListener('keydown', e => {
  if (S.screen !== 'quiz' || S.paused) return;
  if (e.key === 'ArrowRight') { e.preventDefault(); answer(true); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); answer(false); }
});

setInterval(() => {
  if (!S.timerOn || S.paused || S.screen !== 'quiz') return;
  if (S.secs + 1 >= LIMIT) return timeUp();
  S.secs += 1;
  const h = view.querySelector('[data-ref="header"]');
  if (h) h.textContent = headerText();
}, 1000);

window.addEventListener('resize', chrome);
render();
})();
