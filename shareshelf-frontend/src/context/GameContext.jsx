import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useWishlist } from "./WishlistContext";
import { useUI } from "./UIContext";
import { api } from "../api/client";
import { achievements } from "../utils/achievements";
import { fireConfetti, floatText } from "../utils/effects";
import { playSfx } from "../utils/sfx";
import Mascot from "../components/Mascot";

/*
 * The game layer. XP is worked out from the player's REAL activity in ShareShelf
 * (books added, requests sent, books lent...), so it is honest and needs no extra backend.
 * Daily quests, streaks and the "highest XP reached" are remembered in this browser.
 */
const GameContext = createContext(null);

export const LEVEL_XP = 200; // XP needed for each level

export const quests = [
  { id: "browse", icon: "🧭", title: "Explore the shelves", desc: "Visit the Browse page", xp: 15 },
  { id: "wish", icon: "💖", title: "Save a favourite", desc: "Add a book to your wishlist", xp: 15 },
  { id: "share", icon: "📚", title: "Share the love", desc: "Add a book to your shelf", xp: 25 },
  { id: "request", icon: "🤝", title: "Make a friend", desc: "Send a borrow request", xp: 25 },
];

const titles = [
  "Newbie Reader",
  "Page Turner",
  "Bookworm",
  "Shelf Keeper",
  "Library Knight",
  "Story Sage",
  "Legendary Librarian",
];

export const titleFor = (level) => titles[Math.min(level - 1, titles.length - 1)];

export function levelInfo(xp) {
  const level = Math.floor(xp / LEVEL_XP) + 1;
  const into = xp % LEVEL_XP;
  return { level, into, need: LEVEL_XP, pct: (into / LEVEL_XP) * 100 };
}

const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local time

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function GameProvider({ children }) {
  const { user } = useAuth();
  const { ids: wishIds } = useWishlist();
  const { toast } = useUI();
  const location = useLocation();
  const uid = user?.id;

  const [raw, setRaw] = useState(null); // { books, sent, received } from the API
  const [bonus, setBonus] = useState(0); // XP from daily quests
  const [hwm, setHwm] = useState(0); // highest XP ever reached (XP never goes down)
  const [questState, setQuestState] = useState({ date: today(), done: {} });
  const [streak, setStreak] = useState(0);
  const [levelUp, setLevelUp] = useState(null);

  const prevXpRef = useRef(null);
  const bonusRef = useRef(0);
  const questRef = useRef({ date: today(), done: {} });

  // Load this player's saved game data whenever the logged-in user changes
  useEffect(() => {
    prevXpRef.current = null;
    setRaw(null);

    if (!uid) {
      bonusRef.current = 0;
      questRef.current = { date: today(), done: {} };
      setBonus(0);
      setHwm(0);
      setStreak(0);
      setQuestState(questRef.current);
      return;
    }

    bonusRef.current = read(`ss_bonus_${uid}`, 0);
    setBonus(bonusRef.current);
    setHwm(read(`ss_hwm_${uid}`, 0));

    const savedQuests = read(`ss_quests_${uid}`, null);
    questRef.current = savedQuests && savedQuests.date === today() ? savedQuests : { date: today(), done: {} };
    setQuestState(questRef.current);

    // Daily streak
    const saved = read(`ss_streak_${uid}`, { count: 0, last: null });
    const t = today();
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString("en-CA");
    let next = saved;
    if (saved.last !== t) {
      next = { count: saved.last === yesterday ? saved.count + 1 : 1, last: t };
      write(`ss_streak_${uid}`, next);
    }
    setStreak(next.count);
  }, [uid]);

  // Fetch the player's activity. Runs on login, on every page change, and after actions.
  const refresh = useCallback(async () => {
    if (!uid) return;
    try {
      const [books, sent, received] = await Promise.all([
        api("/api/books/my"),
        api("/api/requests/sent"),
        api("/api/requests/received"),
      ]);
      setRaw({ books, sent, received });
    } catch {
      /* game data is optional, so errors are ignored */
    }
  }, [uid]);

  useEffect(() => {
    refresh();
  }, [refresh, location.pathname]);

  const stats = useMemo(() => {
    const r = raw || { books: [], sent: [], received: [] };
    return {
      books: r.books.length,
      sent: r.sent.length,
      borrowed: r.sent.filter((x) => x.status === "APPROVED" || x.status === "RETURNED").length,
      lent: r.received.filter((x) => x.status === "APPROVED" || x.status === "RETURNED").length,
      completedLoans: r.received.filter((x) => x.status === "RETURNED").length,
      wishlist: wishIds.length,
      streak,
    };
  }, [raw, wishIds, streak]);

  const computedXp =
    stats.books * 50 +
    stats.sent * 20 +
    stats.borrowed * 30 +
    stats.lent * 100 +
    stats.completedLoans * 50 +
    stats.wishlist * 5 +
    bonus;
  const xp = Math.max(hwm, computedXp);

  const unlocked = useMemo(() => achievements.filter((a) => a.test(stats)).map((a) => a.id), [stats]);
  const unlockedKey = unlocked.join(",");

  // Celebrations: +XP text, level-ups and new achievements
  useEffect(() => {
    if (!uid || raw === null) return;

    if (xp > hwm) {
      setHwm(xp);
      write(`ss_hwm_${uid}`, xp);
    }

    if (prevXpRef.current !== null && xp > prevXpRef.current) {
      floatText(`+${xp - prevXpRef.current} XP`);
      playSfx("success");
    }
    prevXpRef.current = xp;

    const level = levelInfo(xp).level;
    const levelKey = `ss_level_${uid}`;
    const storedLevel = read(levelKey, null);
    if (storedLevel === null) {
      write(levelKey, level);
    } else if (level > storedLevel) {
      write(levelKey, level);
      setLevelUp(level);
      fireConfetti({ count: 200 });
      playSfx("levelup");
    }

    const badgeKey = `ss_badges_${uid}`;
    const seen = read(badgeKey, null);
    if (seen === null) {
      write(badgeKey, unlocked);
    } else {
      const fresh = unlocked.filter((id) => !seen.includes(id));
      if (fresh.length > 0) {
        write(badgeKey, [...seen, ...fresh]);
        fresh.forEach((id, i) => {
          const badge = achievements.find((a) => a.id === id);
          setTimeout(() => {
            toast(`🏆 Achievement unlocked: ${badge.name}`);
            fireConfetti({ count: 60, power: 7 });
            playSfx("badge");
          }, i * 900);
        });
      }
    }
  }, [xp, unlockedKey, raw, uid]);

  // Call track("browse") etc. when the player does something that counts for a daily quest
  const track = useCallback(
    (id) => {
      if (!uid) return;
      const quest = quests.find((q) => q.id === id);
      if (!quest) return;

      let current = questRef.current;
      if (current.date !== today()) current = { date: today(), done: {} };
      if (current.done[id]) return;

      const next = { ...current, done: { ...current.done, [id]: true } };
      questRef.current = next;
      setQuestState(next);
      write(`ss_quests_${uid}`, next);

      bonusRef.current += quest.xp;
      setBonus(bonusRef.current);
      write(`ss_bonus_${uid}`, bonusRef.current);

      toast(`🎯 Quest complete: ${quest.title} (+${quest.xp} XP)`);
      fireConfetti({ count: 50, power: 6 });
    },
    [uid, toast]
  );

  const info = levelInfo(xp);
  const questsDone = questState.date === today() ? questState.done : {};

  const value = {
    xp,
    ...info,
    title: titleFor(info.level),
    stats,
    unlocked,
    questsDone,
    streak,
    track,
    refresh,
  };

  return (
    <GameContext.Provider value={value}>
      {children}

      {levelUp && (
        <>
          <div className="modal-backdrop fade show" />
          <div className="modal d-block" role="dialog" aria-modal="true" aria-label="Level up">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 rounded-4 text-center p-4 levelup-card">
                <Mascot mood="cheer" size={130} className="mx-auto" />
                <div className="levelup-title">LEVEL UP!</div>
                <div className="levelup-level">Level {levelUp}</div>
                <p className="text-muted">
                  You are now a <strong>{titleFor(levelUp)}</strong>
                </p>
                <button className="btn btn-brand btn-lg" onClick={() => setLevelUp(null)} autoFocus>
                  Awesome!
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
