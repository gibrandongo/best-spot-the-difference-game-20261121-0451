// input.js — mouse and keyboard play.
//
// A click on either panel is translated into panel coordinates and tested
// against the round's unfound differences. Clicking a difference marks it
// found on both panels; clicking anywhere else costs a few points. The
// keyboard offers H for a hint, M to mute, and Enter to start or continue.

function panelPointFromEvent(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (PANEL_W / rect.width),
    y: (event.clientY - rect.top) * (PANEL_H / rect.height)
  };
}

function differenceAt(round, point) {
  for (const diff of round.differences) {
    const dx = point.x - diff.x;
    const dy = point.y - diff.y;
    if (dx * dx + dy * dy <= diff.r * diff.r) return diff;
  }
  return null;
}

function wireInput(state, actions) {
  const onPanelClick = function (event) {
    if (state.phase !== 'playing') return;
    event.preventDefault();
    const point = panelPointFromEvent(event.currentTarget, event);
    actions.clickAt(point);
  };
  // pointerdown (not click) so the game answers at once, on mouse and touch.
  state.leftCanvas.addEventListener('pointerdown', onPanelClick);
  state.rightCanvas.addEventListener('pointerdown', onPanelClick);
  // A right-click on a panel does nothing but open no menu.
  state.leftCanvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  state.rightCanvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  document.getElementById('hint-button').addEventListener('click', function () {
    if (state.phase === 'playing') actions.useHint();
  });
  document.getElementById('mute-button').addEventListener('click', function () {
    const muted = SoundBank.toggleMute();
    document.getElementById('mute-button').textContent = muted ? 'Sound: off' : 'Sound: on';
  });
  document.getElementById('start-button').addEventListener('click', function () {
    SoundBank.ensure();
    SoundBank.playClick();
    actions.startGame();
  });
  document.getElementById('next-button').addEventListener('click', function () {
    SoundBank.playClick();
    actions.nextRound();
  });
  document.getElementById('again-button').addEventListener('click', function () {
    SoundBank.playClick();
    actions.startGame();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'h' || event.key === 'H') {
      if (state.phase === 'playing') actions.useHint();
    } else if (event.key === 'm' || event.key === 'M') {
      const muted = SoundBank.toggleMute();
      document.getElementById('mute-button').textContent = muted ? 'Sound: off' : 'Sound: on';
    } else if (event.key === 'Enter') {
      if (state.phase === 'menu') actions.startGame();
      else if (state.phase === 'roundOver') actions.nextRound();
      else if (state.phase === 'done') actions.startGame();
    }
  });
}
