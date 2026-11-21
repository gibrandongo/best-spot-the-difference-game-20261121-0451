// main.js — Harbour Lights game state and flow.
//
// Phases: menu -> playing -> roundOver -> playing ... -> done.
// The state object is the single source of truth; render.js paints it and
// input.js feeds clicks into the actions below. A ?shot= mid/round/win URL
// state starts a round (or the win screen) with some differences already
// found, so screenshots can be taken of real mid-game pixels.

const GameState = {
  phase: 'menu', // menu | playing | roundOver | done
  roundIndex: 0,
  found: new Set(),
  score: 0,
  totalFound: 0,
  hintsLeft: 3,
  timeLeft: 180,
  hintDiff: null,
  hintPulse: 0,
  lastBonus: 0,
  won: false,
  leftCanvas: null,
  rightCanvas: null,
  timerId: null,
  hintTimerId: null,
  pulseTimerId: null
};

function currentRound() {
  return ROUNDS[GameState.roundIndex];
}

function startRound(index, preFound) {
  const round = ROUNDS[index];
  stopTimer();
  stopHint();
  GameState.roundIndex = index;
  GameState.found = new Set(preFound || []);
  GameState.hintsLeft = round.hints;
  GameState.timeLeft = round.timeLimit;
  GameState.hintDiff = null;
  GameState.phase = 'playing';
  GameState.lastBonus = 0;
  showOverlay(null);
  paintPanels(GameState);
  updateHud(GameState);
  setMessage('Find the 7 differences — click on either picture.');
  SoundBank.playStart();
  startTimer();
}

function startTimer() {
  stopTimer();
  GameState.timerId = setInterval(function () {
    if (GameState.phase !== 'playing') return;
    GameState.timeLeft -= 1;
    if (GameState.timeLeft === 10) SoundBank.playTick();
    if (GameState.timeLeft <= 0) {
      GameState.timeLeft = 0;
      endRound(false);
      return;
    }
    updateHud(GameState);
  }, 1000);
}

function stopTimer() {
  if (GameState.timerId !== null) {
    clearInterval(GameState.timerId);
    GameState.timerId = null;
  }
}

function stopHint() {
  if (GameState.hintTimerId !== null) {
    clearTimeout(GameState.hintTimerId);
    GameState.hintTimerId = null;
  }
  if (GameState.pulseTimerId !== null) {
    clearInterval(GameState.pulseTimerId);
    GameState.pulseTimerId = null;
  }
  GameState.hintDiff = null;
}

function endRound(cleared) {
  stopTimer();
  stopHint();
  GameState.phase = 'roundOver';
  if (cleared) {
    GameState.lastBonus = GameState.timeLeft * 5;
    GameState.score += GameState.lastBonus;
    SoundBank.playRoundClear();
  }
  GameState.totalFound += GameState.found.size;
  fillRoundOverlay(GameState, cleared);
  updateHud(GameState);
  showOverlay('round-overlay');
  if (cleared) setMessage('Round clear! +' + GameState.lastBonus + ' time bonus.');
  else setMessage("Time's up — the remaining differences stay hidden.");
}

function endGame(won) {
  stopTimer();
  stopHint();
  GameState.phase = 'done';
  GameState.won = won;
  if (won) SoundBank.playWin();
  fillEndOverlay(GameState);
  showOverlay('end-overlay');
  setMessage(won ? 'Every difference found. The harbour is yours!' : 'Out of rounds — try again!');
}

const GameActions = {
  startGame: function () {
    GameState.score = 0;
    GameState.totalFound = 0;
    startRound(0);
  },

  nextRound: function () {
    if (GameState.roundIndex + 1 < ROUNDS.length) {
      startRound(GameState.roundIndex + 1);
    } else {
      endGame(GameState.totalFound >= 21);
    }
  },

  clickAt: function (point) {
    if (GameState.phase !== 'playing') return;
    const round = currentRound();
    const diff = differenceAt(round, point);
    if (!diff) {
      GameState.score = Math.max(0, GameState.score - WRONG_CLICK_PENALTY);
      SoundBank.playWrong();
      setMessage('Not a difference — ' + WRONG_CLICK_PENALTY + ' points. Look again!');
      updateHud(GameState);
      return;
    }
    if (GameState.found.has(diff.id)) {
      setMessage('Already found: ' + diff.name + '.');
      return;
    }
    GameState.found.add(diff.id);
    GameState.score += POINTS_PER_FIND;
    SoundBank.playFound();
    paintPanels(GameState);
    updateHud(GameState);
    flashCounter();
    const left = round.differences.length - GameState.found.size;
    if (left === 0) {
      setMessage('All 7 found — ' + diff.name + ' was the last one!');
      setTimeout(function () { endRound(true); }, 650);
    } else {
      setMessage('Found: ' + diff.name + '! ' + left + ' to go.');
    }
  },

  useHint: function () {
    if (GameState.phase !== 'playing' || GameState.hintsLeft <= 0) return;
    const round = currentRound();
    const remaining = round.differences.filter(function (d) { return !GameState.found.has(d.id); });
    if (remaining.length === 0) return;
    GameState.hintsLeft -= 1;
    GameState.score = Math.max(0, GameState.score - POINTS_PER_HINT_COST);
    const pick = remaining[Math.floor(remaining.length / 2)];
    stopHint();
    GameState.hintDiff = pick;
    GameState.hintPulse = 0;
    SoundBank.playHint();
    setMessage('Hint: ' + pick.hint);
    paintPanels(GameState);
    updateHud(GameState);
    stopHint();
    GameState.pulseTimerId = setInterval(function () {
      GameState.hintPulse += 0.25;
      paintPanels(GameState);
    }, 90);
    GameState.hintTimerId = setTimeout(function () {
      stopHint();
      paintPanels(GameState);
    }, 2600);
  }
};

// Deterministic screenshot states, driven by the URL (?shot=mid, round2,
// round3, win). They run the real game code with real pixels — no fake
// frames — so screenshots are honest renders of the game.
function applyShotState() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (!shot) return;
  const firstThree = function (index) {
    return ROUNDS[index].differences.slice(0, 3).map(function (d) { return d.id; });
  };
  if (shot === 'mid') {
    GameState.score = 300;
    startRound(0, firstThree(0));
  } else if (shot === 'round2') {
    GameState.score = 850;
    GameState.totalFound = 7;
    startRound(1, firstThree(1));
  } else if (shot === 'round3') {
    GameState.score = 1700;
    GameState.totalFound = 14;
    startRound(2, firstThree(2));
  } else if (shot === 'win') {
    GameState.score = 2450;
    GameState.totalFound = 21;
    GameState.roundIndex = 2;
    GameState.found = new Set(ROUNDS[2].differences.map(function (d) { return d.id; }));
    GameState.timeLeft = 0;
    paintPanels(GameState);
    updateHud(GameState);
    endGame(true);
  }
}

function bootHarbourLights() {
  GameState.leftCanvas = document.getElementById('panel-left');
  GameState.rightCanvas = document.getElementById('panel-right');
  fillMenuOverlay();
  wireInput(GameState, GameActions);
  // Paint the menu backdrop: round 1, nothing found, so the title screen
  // already shows the two pictures side by side.
  paintPanels(GameState);
  updateHud(GameState);
  applyShotState();
}

document.addEventListener('DOMContentLoaded', bootHarbourLights);
