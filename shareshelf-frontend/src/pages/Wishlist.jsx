import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookCard from "../components/BookCard";
import { SkeletonGrid } from "../components/Skeleton";
import { useWishlist } from "../context/WishlistContext";
import { api } from "../api/client";

export default function Wishlist() {
  const { ids } = useWishlist();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load the saved books. Books that were deleted since are skipped.
  useEffect(() => {
    const missing = ids.filter((id) => !books.some((b) => b.id === id));
    if (missing.length === 0) {
      setLoading(false);
      return;
    }
    Promise.allSettled(missing.map((id) => api(`/api/books/${id}`, { auth: false })))
      .then((results) => {
        const found = results.filter((r) => r.status === "fulfilled").map((r) => r.value);
        setBooks((prev) => [...prev, ...found]);
      })
      .finally(() => setLoading(false));
  }, [ids]);

  // Hide a book as soon as it is un-hearted
  const visible = books.filter((b) => ids.includes(b.id));

  return (
    <div className="my-4">
      <h2 className="fw-bold mb-1">My Wishlist ♥</h2>
      <p className="text-muted">Books you saved for later. Saved in this browser.</p>

      {loading ? (
        <SkeletonGrid count={4} />
      ) : visible.length === 0 ? (
        <div className="text-center text-muted py-5">
          <div className="display-4">♡</div>
          Nothing saved yet. Tap the heart on any book in <Link to="/browse">Browse</Link>.
        </div>
      ) : (
        <div className="row g-4">
          {visible.map((b, i) => (
            <div className="col-12 col-sm-6 col-lg-3" key={b.id}>
              <BookCard book={b} index={i} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
