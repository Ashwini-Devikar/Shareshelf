import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookCard from "../components/BookCard";
import { SkeletonGrid } from "../components/Skeleton";
import { ErrorMsg } from "../components/Status";
import { useUI } from "../context/UIContext";
import { api } from "../api/client";
import { useGame } from "../context/GameContext";

export default function MyShelf() {
  const { toast, confirm } = useUI();
  const { refresh } = useGame();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/books/my")
      .then(setBooks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (book) => {
    const ok = await confirm({
      title: "Remove this book?",
      message: `"${book.title}" will be removed from your shelf. This can't be undone.`,
      confirmText: "Remove",
      danger: true,
    });
    if (!ok) return;

    try {
      await api(`/api/books/${book.id}`, { method: "DELETE" });
      setBooks((prev) => prev.filter((b) => b.id !== book.id));
      toast("Book removed from your shelf");
      refresh();
    } catch (err) {
      toast(err.message, "error");
    }
  };

  return (
    <div className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold mb-0">My Shelf</h2>
        <Link to="/add-book" className="btn btn-brand">+ Add Book</Link>
      </div>

      <ErrorMsg message={error} />

      {loading ? (
        <SkeletonGrid count={4} />
      ) : books.length === 0 ? (
        <div className="text-center text-muted py-5">
          <div className="display-4">📚</div>
          Your shelf is empty. <Link to="/add-book">Add your first book</Link>.
        </div>
      ) : (
        <div className="row g-4">
          {books.map((b, i) => (
            <div className="col-12 col-sm-6 col-lg-3" key={b.id}>
              <div className="d-flex flex-column h-100">
                <BookCard book={b} index={i} />
                <button className="btn btn-outline-danger btn-sm mt-2" onClick={() => handleDelete(b)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
