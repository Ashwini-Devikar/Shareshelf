import { useEffect, useState } from "react";
import { bookGradient } from "../utils/bookColor";

// Shows the cover image if the book has one that loads, otherwise a coloured fallback.
export default function BookCover({ book, height = 200, className = "" }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [book.coverUrl]);

  const showImage = Boolean(book.coverUrl) && !failed;

  return (
    <div
      className={`book-cover ${className}`}
      style={{ height, background: showImage ? "var(--bs-secondary-bg)" : bookGradient(book.id) }}
    >
      {showImage ? (
        <img src={book.coverUrl} alt={`Cover of ${book.title}`} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <div className="cover-fallback">
          <span className="cover-emoji">📖</span>
          <span className="cover-title">{book.title}</span>
        </div>
      )}
    </div>
  );
}
