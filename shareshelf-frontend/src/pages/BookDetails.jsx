import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import BookCover from "../components/BookCover";
import WishlistButton from "../components/WishlistButton";
import { Loading, ErrorMsg } from "../components/Status";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { api } from "../api/client";
import { useGame } from "../context/GameContext";

export default function BookDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useUI();
  const { track, refresh } = useGame();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    setLoading(true);
    api(`/api/books/${id}`, { auth: false })
      .then(setBook)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;

  if (loadError || !book) {
    return (
      <div className="text-center my-5">
        <p>{loadError || "Book not found."}</p>
        <Link to="/browse">Back to Browse</Link>
      </div>
    );
  }

  const isMine = user && book.ownerId === user.id;
  const canRequest = book.status === "AVAILABLE" && !isMine;

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: `/books/${book.id}` } });
      return;
    }
    setSending(true);
    setSendError("");
    try {
      await api("/api/requests", { method: "POST", body: { bookId: book.id, message } });
      setSent(true);
      setBook({ ...book, status: "REQUESTED" });
      toast("Request sent to the owner!");
      track("request");
      refresh();
    } catch (err) {
      setSendError(err.message);
      toast(err.message, "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="row g-4 my-4">
      <div className="col-md-4">
        <div className="position-relative">
          <BookCover book={book} height={380} className="rounded-4 shadow" />
          {!isMine && (
            <div className="cover-actions">
              <WishlistButton bookId={book.id} />
            </div>
          )}
        </div>
      </div>

      <div className="col-md-8">
        <Link to="/browse" className="small">← Back to Browse</Link>
        <h2 className="fw-bold mt-2">{book.title}</h2>
        <p className="text-muted">by {book.author}</p>

        <div className="d-flex gap-2 mb-3">
          <span className="badge bg-body-secondary text-body border">{book.genre || "General"}</span>
          <StatusBadge status={book.status} />
        </div>

        {book.description && <p>{book.description}</p>}

        <ul className="list-unstyled text-muted">
          <li>Condition: <strong>{book.condition}</strong></li>
          <li>Owner: <strong>{book.owner}</strong>{book.city ? ` (${book.city})` : ""}</li>
        </ul>

        {isMine && <div className="alert alert-info">This book is on your shelf.</div>}

        {canRequest && !sent && (
          <form onSubmit={handleRequest} className="mt-3" style={{ maxWidth: 480 }}>
            <ErrorMsg message={sendError} />
            <label className="form-label">Message to the owner (optional)</label>
            <textarea
              className="form-control mb-3"
              rows={3}
              maxLength={300}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="btn btn-brand" type="submit" disabled={sending}>
              {sending ? "Sending..." : user ? "Request to Borrow" : "Login to Request"}
            </button>
          </form>
        )}

        {sent && (
          <div className="alert alert-success mt-3">
            Request sent! Track it under <Link to="/my-requests">My Requests</Link>.
          </div>
        )}

        {!canRequest && !isMine && !sent && (
          <div className="alert alert-secondary mt-3">This book is not available right now.</div>
        )}
      </div>
    </div>
  );
}
