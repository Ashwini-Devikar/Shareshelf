import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loading, ErrorMsg } from "../components/Status";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { shortDate } from "../utils/bookColor";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api("/api/books/my"), api("/api/requests/sent"), api("/api/requests/received")])
      .then(([books, sent, received]) => setData({ books, sent, received }))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <ErrorMsg message={error} />;
  if (!data) return <Loading text="Loading your dashboard..." />;

  const { books, sent, received } = data;

  const pending = received.filter((r) => r.status === "PENDING");
  const lentOut = received.filter((r) => r.status === "APPROVED");
  const borrowing = sent.filter((r) => r.status === "APPROVED");

  // One list of everything with a due date: books I borrowed and books I lent out
  const dueList = [
    ...borrowing.map((r) => ({ ...r, kind: "borrowed" })),
    ...lentOut.map((r) => ({ ...r, kind: "lent" })),
  ].sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)));

  const stats = [
    { icon: "📚", label: "Books on my shelf", value: books.length, to: "/my-shelf" },
    { icon: "🤝", label: "Lent out right now", value: lentOut.length, to: "/received-requests" },
    { icon: "📖", label: "Books I'm borrowing", value: borrowing.length, to: "/my-requests" },
    { icon: "⏳", label: "Waiting for my reply", value: pending.length, to: "/received-requests" },
  ];

  return (
    <div className="my-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-0">Hi, {user.name} 👋</h2>
          <p className="text-muted mb-0">Here's what's happening with your books.</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/add-book" className="btn btn-brand">+ Add Book</Link>
          <Link to="/browse" className="btn btn-outline-brand">Browse</Link>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center">
          <span>
            ⏳ You have <strong>{pending.length}</strong> borrow request{pending.length > 1 ? "s" : ""} waiting for
            your reply.
          </span>
          <Link to="/received-requests" className="btn btn-sm btn-warning">Review</Link>
        </div>
      )}

      <div className="row g-3 mb-4">
        {stats.map((s) => (
          <div className="col-6 col-lg-3" key={s.label}>
            <Link to={s.to} className="text-decoration-none text-body">
              <div className="stat-card fade-up">
                <span className="stat-icon mb-2">{s.icon}</span>
                <div className="stat-number">{s.value}</div>
                <div className="text-muted small">{s.label}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <h5 className="fw-bold mb-3">Upcoming due dates</h5>
      {dueList.length === 0 ? (
        <div className="text-center text-muted py-4 border rounded-4 bg-body">
          Nothing is due. Borrowed and lent books will show up here.
        </div>
      ) : (
        <div className="list-group shadow-sm">
          {dueList.map((r) => {
            const overdue = shortDate(r.dueDate) < today();
            return (
              <div className="list-group-item d-flex justify-content-between align-items-center" key={`${r.kind}-${r.id}`}>
                <div>
                  <div className="fw-semibold">{r.bookTitle}</div>
                  <div className="small text-muted">
                    {r.kind === "borrowed" ? `Borrowed from ${r.owner}` : `Lent to ${r.borrower}`}
                  </div>
                </div>
                <div className="text-end">
                  <div className={overdue ? "text-danger fw-semibold" : ""}>{shortDate(r.dueDate)}</div>
                  {overdue && <span className="badge bg-danger">Overdue</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
