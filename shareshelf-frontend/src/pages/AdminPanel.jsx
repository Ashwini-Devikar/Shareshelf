import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { Loading, ErrorMsg } from "../components/Status";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { shortDate } from "../utils/bookColor";

export default function AdminPanel() {
  const { toast, confirm } = useUI();
  const { user: me } = useAuth();
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api("/api/admin/users"), api("/api/books", { auth: false })])
      .then(([u, b]) => {
        setUsers(u);
        setBooks(b);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const removeUser = async (u) => {
    const ok = await confirm({
      title: "Delete this user?",
      message: `${u.name} (${u.email}) and all of their books and requests will be permanently removed.`,
      confirmText: "Delete user",
      danger: true,
    });
    if (!ok) return;
    try {
      await api(`/api/admin/users/${u.id}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
      setBooks((prev) => prev.filter((b) => b.ownerId !== u.id));
      toast("User deleted");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const removeBook = async (b) => {
    const ok = await confirm({
      title: "Remove this book?",
      message: `"${b.title}" (owned by ${b.owner}) will be removed from ShareShelf.`,
      confirmText: "Remove",
      danger: true,
    });
    if (!ok) return;
    try {
      await api(`/api/books/${b.id}`, { method: "DELETE" });
      setBooks((prev) => prev.filter((x) => x.id !== b.id));
      toast("Book removed");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const available = books.filter((b) => b.status === "AVAILABLE").length;
  const out = books.length - available;

  return (
    <div className="my-4">
      <h2 className="fw-bold mb-3">🛡️ Admin Panel</h2>
      <ErrorMsg message={error} />

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="row g-3 mb-4">
            {[
              ["👥", users.length, "Users"],
              ["📚", books.length, "Books"],
              ["✅", available, "Available"],
              ["🔁", out, "Requested / borrowed"],
            ].map(([icon, n, label]) => (
              <div className="col-6 col-md-3" key={label}>
                <div className="card border-0 shadow-sm rounded-4 text-center py-3">
                  <div className="fs-3">{icon}</div>
                  <div className="fs-3 fw-bold">{n}</div>
                  <div className="text-muted small">{label}</div>
                </div>
              </div>
            ))}
          </div>

          <ul className="nav nav-pills mb-3">
            <li className="nav-item">
              <button className={`nav-link ${tab === "users" ? "active" : ""}`} onClick={() => setTab("users")}>
                Users
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${tab === "books" ? "active" : ""}`} onClick={() => setTab("books")}>
                Books
              </button>
            </li>
          </ul>

          {tab === "users" ? (
            <div className="table-responsive bg-body rounded-3 shadow-sm border">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>City</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="fw-semibold">{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.city || "—"}</td>
                      <td>
                        <span className={`badge ${u.role === "ADMIN" ? "bg-warning text-dark" : "bg-secondary"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{shortDate(u.createdAt)}</td>
                      <td className="text-end">
                        {u.role !== "ADMIN" && u.id !== me.id && (
                          <button className="btn btn-sm btn-outline-danger" onClick={() => removeUser(u)}>
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="table-responsive bg-body rounded-3 shadow-sm border">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {books.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-4">No books yet.</td>
                    </tr>
                  )}
                  {books.map((b) => (
                    <tr key={b.id}>
                      <td className="fw-semibold">
                        <Link to={`/books/${b.id}`}>{b.title}</Link>
                      </td>
                      <td>{b.author}</td>
                      <td>{b.owner}</td>
                      <td><StatusBadge status={b.status} /></td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          disabled={b.status !== "AVAILABLE"}
                          title={b.status !== "AVAILABLE" ? "Only available books can be removed" : ""}
                          onClick={() => removeBook(b)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
