// The API has no cover colour, so we pick a stable one from the book id.
const palette = ["#5b3df5", "#e8590c", "#0b7285", "#2b8a3e", "#a61e4d", "#364fc7", "#c92a2a", "#5f3dc4"];

export function bookColor(id) {
  return palette[Number(id) % palette.length];
}

// Two-colour gradient used when a book has no cover image
export function bookGradient(id) {
  const a = palette[Number(id) % palette.length];
  const b = palette[(Number(id) + 3) % palette.length];
  return `linear-gradient(135deg, ${a}, ${b})`;
}

export function shortDate(value) {
  return value ? String(value).slice(0, 10) : "—";
}
