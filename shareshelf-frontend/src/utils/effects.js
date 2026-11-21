// Visual effects: confetti bursts and floating "+XP" text. Plain DOM and canvas, no libraries.
const colors = ["#ff6b9d", "#ffd93d", "#6bcbff", "#9a8bff", "#5eead4", "#ff9f43"];

function reducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function fireConfetti({ x = window.innerWidth / 2, y = window.innerHeight / 3, count = 120, power = 9 } = {}) {
  if (typeof window === "undefined" || reducedMotion()) return;

  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.cssText =
    "position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:3000";
  document.body.appendChild(canvas);
  const c = canvas.getContext("2d");

  const parts = Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * power + power * 0.3;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - power * 0.4,
      size: 4 + Math.random() * 5,
      color: colors[(Math.random() * colors.length) | 0],
      rot: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.4,
      life: 0,
    };
  });

  let frame = 0;
  function tick() {
    frame += 1;
    c.clearRect(0, 0, canvas.width, canvas.height);
    let alive = 0;

    for (const p of parts) {
      p.vy += 0.22;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life += 1;

      if (p.y < canvas.height + 20 && p.life < 150) {
        alive += 1;
        c.save();
        c.translate(p.x, p.y);
        c.rotate(p.rot);
        c.globalAlpha = Math.max(0, 1 - p.life / 150);
        c.fillStyle = p.color;
        c.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        c.restore();
      }
    }

    if (alive > 0 && frame < 300) requestAnimationFrame(tick);
    else canvas.remove();
  }
  requestAnimationFrame(tick);
}

export function floatText(text, x = window.innerWidth / 2, y = 90) {
  if (typeof document === "undefined") return;
  const el = document.createElement("div");
  el.className = "float-text";
  el.textContent = text;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1400);
}
