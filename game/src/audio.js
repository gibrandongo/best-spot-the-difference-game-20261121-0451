// audio.js — all game sounds, made with WebAudio. No audio files.
//
// A tiny synth: short oscillator notes with an envelope. The game calls
// playFound, playWrong, playHint, playClick, playRoundClear and playWin.

const SoundBank = {
  ctx: null,
  muted: false,

  ensure: function () {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },

  toggleMute: function () {
    this.muted = !this.muted;
    return this.muted;
  },

  // One note: frequency in Hz, start delay in seconds, length in seconds.
  note: function (freq, delay, length, type, volume) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(volume || 0.18, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + length);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + length + 0.05);
  },

  // A satisfying two-note chime when a difference is found.
  playFound: function () {
    this.note(660, 0, 0.18, 'sine', 0.22);
    this.note(990, 0.09, 0.28, 'sine', 0.2);
    this.note(1320, 0.18, 0.3, 'triangle', 0.1);
  },

  // A dull low buzz for a wrong click.
  playWrong: function () {
    this.note(140, 0, 0.18, 'sawtooth', 0.1);
    this.note(110, 0.05, 0.2, 'sawtooth', 0.08);
  },

  // A soft blip when a hint is spent.
  playHint: function () {
    this.note(520, 0, 0.12, 'triangle', 0.16);
    this.note(780, 0.08, 0.16, 'triangle', 0.14);
  },

  // A quiet tick for ordinary button clicks.
  playClick: function () {
    this.note(440, 0, 0.06, 'triangle', 0.1);
  },

  // A rising arpeggio when a round is cleared.
  playRoundClear: function () {
    const steps = [523, 659, 784, 1047];
    for (let i = 0; i < steps.length; i++) this.note(steps[i], i * 0.1, 0.25, 'triangle', 0.18);
  },

  // A longer fanfare for finishing all three rounds.
  playWin: function () {
    const steps = [523, 659, 784, 1047, 784, 1047, 1319];
    for (let i = 0; i < steps.length; i++) this.note(steps[i], i * 0.12, 0.3, 'triangle', 0.18);
    this.note(262, 0, 0.9, 'sine', 0.08);
  },

  // A short rising jingle when a round starts.
  playStart: function () {
    this.note(392, 0, 0.12, 'triangle', 0.14);
    this.note(523, 0.1, 0.14, 'triangle', 0.14);
    this.note(659, 0.2, 0.2, 'triangle', 0.14);
  },

  // A short tick when the timer drops under ten seconds.
  playTick: function () {
    this.note(880, 0, 0.05, 'square', 0.05);
  }
};
