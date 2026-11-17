import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { mockBooks } from "../data/mockBooks";
import { myBooks } from "../data/mockUser";

export default function BookDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const book = [...mockBooks, ...myBooks].find((b) => b.id === Number(id));

  if (!book) {
    return (
      <div className="text-center my-5">
        <p>Book not found.</p>
        <Link to="/browse">Back to Browse</Link>
      </div>
    );
  }

  const isMine = book.owner === "You";
  const canRequest = book.status === "AVAILABLE" && !isMine;

  const handleRequest = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: `/books/${book.id}` } });
      return;
    }
    // Week 3: POST /api/requests { bookId, message }
    setSent(true);
  };

  return (
    <div className="row g-4 my-4">
      <div className="col-md-4">
        <div className="book-cover rounded-4" style={{ background: book.color, height: 320 }}>
          📖
        </div>
      </div>

      <div className="col-md-8">
        <Link to="/browse" className="small">← Back to Browse</Link>
        <h2 className="fw-bold mt-2">{book.title}</h2>
        <p className="text-muted">by {book.author}</p>

        <div className="d-flex gap-2 mb-3">
          <span className="badge text-bg-light border">{book.genre}</span>
          <StatusBadge status={book.status} />
        </div>

        <ul className="list-unstyled text-muted">
          <li>Condition: <strong>{book.condition}</strong></li>
          <li>Owner: <strong>{book.owner}</strong> ({book.city})</li>
        </ul>

        {isMine && <div className="alert alert-info">This book is on your shelf.</div>}

        {canRequest && !sent && (
          <form onSubmit={handleRequest} className="mt-3" style={{ maxWidth: 480 }}>
            <label className="form-label">Message to the owner (optional)</label>
            <textarea
              className="form-control mb-3"
              rows={3}
              maxLength={300}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="btn btn-brand" type="submit">Request to Borrow</button>
          </form>
        )}

        {sent && (
          <div className="alert alert-success mt-3">
            Request sent! Track it under <Link to="/my-requests">My Requests</Link>.
          </div>
        )}

        {!canRequest && !isMine && (
          <div className="alert alert-secondary mt-3">This book is not available right now.</div>
        )}
      </div>
    </div>
  );
}
