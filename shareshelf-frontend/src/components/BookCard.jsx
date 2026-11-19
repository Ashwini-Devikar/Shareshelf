import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import BookCover from "./BookCover";
import WishlistButton from "./WishlistButton";
import { useAuth } from "../context/AuthContext";

export default function BookCard({ book, index = 0 }) {
  const { user } = useAuth();
  const isMine = user && book.ownerId === user.id;

  return (
    <div className="card book-card h-100 fade-up" style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}>
      <div className="position-relative">
        <Link to={`/books/${book.id}`} aria-label={`View ${book.title}`}>
          <BookCover book={book} height={200} />
        </Link>
        <div className="cover-status">
          <StatusBadge status={book.status} />
        </div>
        {!isMine && (
          <div className="cover-actions">
            <WishlistButton bookId={book.id} />
          </div>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <span className="badge bg-body-secondary text-body border align-self-start mb-2">
          {book.genre || "General"}
        </span>

        <h6 className="card-title fw-bold mb-1 line-clamp-2">{book.title}</h6>
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
