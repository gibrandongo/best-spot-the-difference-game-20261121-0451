// render.js — paints the two panels and keeps the HUD honest.
//
// paintPanels redraws both canvases from the scene painter, then draws a
// green ring on every difference already found (on both panels, so the
// player can see the pair) and a pulsing hint ring while a hint is live.
// updateHud writes the round, score, timer, hint count and the big
// "N of 7 differences left" counter.

const MARKER_GREEN = '#2fae5f';
const MARKER_RING = 22;

function paintPanels(state) {
  const round = ROUNDS[state.roundIndex];
  const leftCtx = state.leftCanvas.getContext('2d');
  const rightCtx = state.rightCanvas.getContext('2d');
  const changed = new Set(round.differences.map(function (d) { return d.id; }));

  drawHarbourScene(leftCtx, state.roundIndex, new Set());
  drawHarbourScene(rightCtx, state.roundIndex, changed);

  for (const diff of round.differences) {
    if (state.found.has(diff.id)) {
      drawFoundMarker(leftCtx, diff.x, diff.y);
      drawFoundMarker(rightCtx, diff.x, diff.y);
    }
  }

  if (state.hintDiff) {
    drawHintMarker(leftCtx, state.hintDiff.x, state.hintDiff.y, state.hintPulse);
    drawHintMarker(rightCtx, state.hintDiff.x, state.hintDiff.y, state.hintPulse);
  }
}

function drawFoundMarker(ctx, x, y) {
  ctx.save();
  ctx.strokeStyle = MARKER_GREEN;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, MARKER_RING, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(47, 174, 95, 0.18)';
  ctx.beginPath();
  ctx.arc(x, y, MARKER_RING, 0, Math.PI * 2);
  ctx.fill();
  // A small check in the middle of the ring.
  ctx.strokeStyle = MARKER_GREEN;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 8, y);
  ctx.lineTo(x - 2, y + 6);
  ctx.lineTo(x + 9, y - 6);
  ctx.stroke();
  ctx.restore();
}

function drawHintMarker(ctx, x, y, pulse) {
  const r = MARKER_RING + 4 + Math.sin(pulse) * 4;
  ctx.save();
  ctx.strokeStyle = '#f2a007';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m + ':' + (s < 10 ? '0' : '') + s;
}

function updateHud(state) {
  const round = ROUNDS[state.roundIndex];
  const left = round.differences.length - state.found.size;

  document.getElementById('round-label').textContent =
    'Round ' + (state.roundIndex + 1) + ' of 3 — ' + round.name;
  document.getElementById('score-value').textContent = String(state.score);
  const timerEl = document.getElementById('time-value');
  timerEl.textContent = formatTime(state.timeLeft);
  timerEl.classList.toggle('urgent', state.timeLeft <= 30 && state.phase === 'playing');
  document.getElementById('hint-count').textContent = String(state.hintsLeft);
  document.getElementById('hint-button').disabled = state.hintsLeft <= 0 || state.phase !== 'playing';
  document.getElementById('hint-button').title = 'A hint costs ' + POINTS_PER_HINT_COST + ' points';

  document.getElementById('counter-big').textContent =
    left + ' of ' + round.differences.length + ' differences left';
  document.getElementById('counter-sub').textContent =
    state.found.size + ' found  ·  ' + round.blurb;

  // Dots: one per difference, filled when found.
  const dots = document.getElementById('found-dots');
  dots.innerHTML = '';
  for (const diff of round.differences) {
    const dot = document.createElement('span');
    dot.className = 'dot' + (state.found.has(diff.id) ? ' found' : '');
    dot.title = state.found.has(diff.id) ? diff.name : 'Not found yet';
    dots.appendChild(dot);
  }

  // Names of the differences already found.
  const names = round.differences
    .filter(function (d) { return state.found.has(d.id); })
    .map(function (d) { return d.name; });
  document.getElementById('found-list').textContent =
    names.length > 0 ? 'Found: ' + names.join(' · ') : 'Nothing found yet — look closely!';
}

function setMessage(text) {
  document.getElementById('message-line').textContent = text;
}

// Briefly swell the big counter when a difference is found.
function flashCounter() {
  const el = document.getElementById('counter-big');
  el.classList.remove('flash');
  void el.offsetWidth;
  el.classList.add('flash');
}

function showOverlay(id) {
  const overlays = document.querySelectorAll('.overlay');
  for (const el of overlays) el.classList.add('hidden');
  if (id) document.getElementById(id).classList.remove('hidden');
}

function fillMenuOverlay() {
  document.getElementById('menu-rounds').textContent =
    ROUNDS.map(function (r, i) {
      return 'Round ' + (i + 1) + ' — ' + r.name + ': 7 differences, ' + formatTime(r.timeLimit) + ' on the clock.';
    }).join(' ');
}

function fillRoundOverlay(state, cleared) {
  const round = ROUNDS[state.roundIndex];
  document.getElementById('round-title').textContent = cleared
    ? 'Round ' + (state.roundIndex + 1) + ' clear!'
    : "Time's up!";
  document.getElementById('round-detail').textContent = cleared
    ? 'You found all 7 differences in ' + round.name + '. Time bonus: +' + state.lastBonus + ' points.'
    : 'You found ' + state.found.size + ' of 7 differences in ' + round.name + '.';
  document.getElementById('round-score').textContent = 'Score: ' + state.score;
  document.getElementById('next-button').textContent =
    state.roundIndex + 1 < ROUNDS.length ? 'Next round' : 'See the final score';
}

function fillEndOverlay(state) {
  const total = ROUNDS.reduce(function (n, r) { return n + r.differences.length; }, 0);
  document.getElementById('end-title').textContent =
    state.won ? 'You found them all!' : 'The harbour keeps its secrets…';
  document.getElementById('end-detail').textContent =
    'You found ' + state.totalFound + ' of ' + total + ' differences across three rounds.';
  document.getElementById('end-score').textContent = 'Final score: ' + state.score;
}
