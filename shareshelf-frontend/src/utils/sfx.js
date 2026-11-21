// Tiny retro sound effects made with the browser's Web Audio API (no audio files).
// Sound is OFF by default and can be switched on with the speaker button in the navbar.
let ctx = null;
let enabled = false;

try {
  enabled = localStorage.getItem("shareshelf_sound") === "on";
} catch {
  enabled = false;
}

export const isSoundOn = () => enabled;

export function setSound(on) {
  enabled = on;
  try {
    localStorage.setItem("shareshelf_sound", on ? "on" : "off");
  } catch {
    /* ignore */
  }
}

function tone(freq, start, duration, type = "square", volume = 0.05) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  ctx = ctx || new AudioCtx();
  if (ctx.state === "suspended") ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t = ctx.currentTime + start;

  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration);
}

export function playSfx(name) {
  if (!enabled) return;
  try {
    switch (name) {
      case "click":
        tone(520, 0, 0.06);
        break;
      case "pop":
        tone(880, 0, 0.07, "sine");
        break;
      case "success":
        tone(523, 0, 0.1);
        tone(659, 0.1, 0.1);
        tone(784, 0.2, 0.18);
        break;
      case "badge":
        tone(784, 0, 0.1, "triangle", 0.07);
        tone(1175, 0.1, 0.28, "triangle", 0.07);
        break;
      case "levelup":
        [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.22, "triangle", 0.07));
        break;
      default:
        break;
    }
  } catch {
    /* sound is optional */
  }
}
