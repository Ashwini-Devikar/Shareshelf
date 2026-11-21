import { Link } from "react-router-dom";
import { useGame } from "../context/GameContext";

// Small level and XP display in the navbar. Click it to open the Quest Log.
export default function PlayerBar() {
  const { level, pct, into, need, streak, title } = useGame();

  return (
    <Link to="/quests" className="player-bar" title={`${title}: ${into}/${need} XP to next level`}>
      <span className="lvl-badge">Lv {level}</span>
      <span className="xp-track" aria-hidden="true">
        <span className="xp-fill" style={{ width: `${pct}%` }} />
      </span>
      {streak > 1 && <span className="small fw-bold">🔥{streak}</span>}
    </Link>
  );
}
