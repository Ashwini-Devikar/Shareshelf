import { createContext, useContext, useEffect, useState } from "react";
import { fireConfetti } from "../utils/effects";
import { isSoundOn, playSfx, setSound } from "../utils/sfx";

// Look and feel settings: light/dark, arcade (game) style on/off, sound on/off.
const ThemeContext = createContext(null);
const THEME_KEY = "shareshelf_theme";
const ARCADE_KEY = "shareshelf_arcade";

function initialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* storage blocked */
  }
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Arcade style is ON unless the player switched it off
function initialArcade() {
  try {
    return localStorage.getItem(ARCADE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);
  const [arcade, setArcade] = useState(initialArcade);
  const [sound, setSoundState] = useState(isSoundOn);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-ss-style", arcade ? "arcade" : "classic");
    try {
      localStorage.setItem(ARCADE_KEY, arcade ? "on" : "off");
    } catch {
      /* ignore */
    }
  }, [arcade]);

  // Click feedback: a small sparkle burst in arcade mode, and a click sound if sound is on
  useEffect(() => {
    const onClick = (e) => {
      const target = e.target.closest && e.target.closest("button, .btn, .nav-link, .dropdown-item");
      if (!target) return;
      playSfx("click");
      if (arcade) fireConfetti({ x: e.clientX, y: e.clientY, count: 12, power: 3.5 });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [arcade]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const toggleArcade = () => setArcade((a) => !a);
  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    setSoundState(next);
    if (next) playSfx("pop");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle, arcade, toggleArcade, sound, toggleSound }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
