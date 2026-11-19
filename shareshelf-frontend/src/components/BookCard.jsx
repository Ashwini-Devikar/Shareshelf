import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { bookColor } from "../utils/bookColor";

export default function BookCard({ book }) {
  return (
    <div className="card book-card h-100">
      <div className="book-cover" style={{ background: bookColor(book.id) }}>
        📖
      </div>

      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <span className="badge text-bg-light border">{book.genre || "General"}</span>
          <StatusBadge status={book.status} />
        </div>

        <h6 className="card-title fw-bold mt-2 mb-1">{book.title}</h6>
        <p className="text-muted small mb-2">by {book.author}</p>

        <p className="small text-muted mb-3">
          Owner: {book.owner}
          {book.city ? ` · ${book.city}` : ""}
          <br />
          Condition: {book.condition}
        </p>

        <Link to={`/books/${book.id}`} className="btn btn-brand btn-sm mt-auto">
          View details
        </Link>
      </div>
    </div>
  );
}
