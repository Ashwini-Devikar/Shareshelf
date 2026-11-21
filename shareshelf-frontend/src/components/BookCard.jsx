import { useRef } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import BookCover from "./BookCover";
import WishlistButton from "./WishlistButton";
import { useAuth } from "../context/AuthContext";

// Book condition decides the trading-card rarity
const rarityMap = {
  NEW: { name: "Legendary", cls: "legendary" },
  GOOD: { name: "Rare", cls: "rare" },
  FAIR: { name: "Uncommon", cls: "uncommon" },
  WORN: { name: "Common", cls: "common" },
};

export default function BookCard({ book, index = 0 }) {
  const { user } = useAuth();
  const isMine = user && book.ownerId === user.id;
  const rarity = rarityMap[book.condition] || rarityMap.GOOD;
  const cardRef = useRef(null);

  // Tilt the card toward the mouse, like a collectible card
  const handleMove = (e) => {
    const el = cardRef.current;
    if (!el || (window.matchMedia && window.matchMedia("(hover: none)").matches)) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--ry", `${(px - 0.5) * 10}deg`);
    el.style.setProperty("--rx", `${(0.5 - py) * 10}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };

  const handleLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
  };

  return (
    <div className="h-100 fade-up" style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}>
      <div
        ref={cardRef}
        className={`card book-card h-100 rarity-${rarity.cls}`}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <div className="position-relative">
          <Link to={`/books/${book.id}`} aria-label={`View ${book.title}`}>
            <BookCover book={book} height={200} />
          </Link>
          <div className="cover-status">
            <StatusBadge status={book.status} />
          </div>
          <span className="rarity-tag">★ {rarity.name}</span>
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

        <div className="card-shine" aria-hidden="true" />
      </div>
    </div>
  );
}
