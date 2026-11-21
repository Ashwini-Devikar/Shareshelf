import { Link } from "react-router-dom";
import Mascot from "../components/Mascot";
import { useGame, quests } from "../context/GameContext";
import { achievements } from "../utils/achievements";

const earnTable = [
  ["Add a book to your shelf", "+50 XP"],
  ["Send a borrow request", "+20 XP"],
  ["Get a request approved", "+30 XP"],
  ["Lend a book to someone", "+100 XP"],
  ["Get a lent book returned", "+50 XP"],
  ["Save a book to your wishlist", "+5 XP"],
  ["Finish a daily quest", "+15 to +25 XP"],
];

export default function Quests() {
  const game = useGame();
  const unlocked = new Set(game.unlocked);
  const doneCount = quests.filter((q) => game.questsDone[q.id]).length;

  return (
    <div className="my-4">
      <div className="row g-4 align-items-center mb-4">
        <div className="col-auto">
          <Mascot size={110} mood={doneCount === quests.length ? "cheer" : "happy"} />
        </div>
        <div className="col">
          <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
            <span className="lvl-badge fs-6">Lv {game.level}</span>
            <h2 className="fw-bold mb-0">{game.title}</h2>
          </div>
          <div className="xp-track xp-track-lg my-2">
            <span className="xp-fill" style={{ width: `${game.pct}%` }} />
          </div>
          <div className="text-muted small">
            {game.into} / {game.need} XP to level {game.level + 1} · Total {game.xp} XP
            {game.streak > 0 && ` · 🔥 ${game.streak}-day streak`}
          </div>
        </div>
      </div>

      <h4 className="fw-bold mb-3">
        Daily quests{" "}
        <span className="text-muted fs-6">
          ({doneCount}/{quests.length} done, resets every day)
        </span>
      </h4>
      <div className="row g-3 mb-5">
        {quests.map((q) => {
          const done = Boolean(game.questsDone[q.id]);
          return (
            <div className="col-12 col-md-6" key={q.id}>
              <div className={`quest-item ${done ? "done" : ""}`}>
                <span className="quest-icon">{done ? "✅" : q.icon}</span>
                <div className="flex-grow-1">
                  <div className="fw-semibold">{q.title}</div>
                  <div className="small text-muted">{q.desc}</div>
                </div>
                <span className="badge bg-warning text-dark">+{q.xp} XP</span>
              </div>
            </div>
          );
        })}
      </div>

      <h4 className="fw-bold mb-3">
        Achievements{" "}
        <span className="text-muted fs-6">
          ({unlocked.size}/{achievements.length} unlocked)
        </span>
      </h4>
      <div className="row g-3 mb-5">
        {achievements.map((a) => {
          const has = unlocked.has(a.id);
          return (
            <div className="col-6 col-md-4 col-lg-3" key={a.id}>
              <div className={`badge-card ${has ? "unlocked" : "locked"}`}>
                <div className="badge-icon">{has ? a.icon : "🔒"}</div>
                <div className="fw-bold">{a.name}</div>
                <div className="small text-muted">{a.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      <h4 className="fw-bold mb-3">How to earn XP</h4>
      <div className="table-responsive bg-body rounded-3 shadow-sm border mb-3">
        <table className="table mb-0">
          <tbody>
            {earnTable.map(([what, xp]) => (
              <tr key={what}>
                <td>{what}</td>
                <td className="text-end fw-semibold">{xp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-muted small">
        Level up by sharing books. Your XP never goes down. <Link to="/browse">Find a book to start a quest →</Link>
      </p>
    </div>
  );
}
