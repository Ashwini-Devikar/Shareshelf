import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookCard from "../components/BookCard";
import { SkeletonGrid } from "../components/Skeleton";
import { ErrorMsg } from "../components/Status";
import { api } from "../api/client";

const steps = [
  { icon: "📚", title: "List your books", text: "Add the books you've finished to your virtual shelf." },
  { icon: "🔎", title: "Find a book", text: "Search by title, author or genre and see who has it." },
  { icon: "🤝", title: "Borrow & return", text: "Send a request, get approved, and return by the due date." },
];

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/books?available=true", { auth: false })
      .then((data) => setBooks(data.slice(0, 4)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero p-4 p-md-5 my-4 text-center">
        <h1 className="display-4 fw-bold">
          Share books. <span className="gradient-text">Read more.</span>
        </h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: 600 }}>
          ShareShelf connects readers who have books sitting idle with people who want to read them. Free, local and
          friendly.
        </p>
        <div className="d-flex justify-content-center gap-2 mt-4 flex-wrap">
          <Link to="/browse" className="btn btn-brand btn-lg px-4">Browse Books</Link>
          <Link to="/register" className="btn btn-outline-brand btn-lg px-4">Start Sharing</Link>
        </div>
      </section>

      <section className="my-5">
        <h3 className="text-center fw-bold mb-4">How it works</h3>
        <div className="row g-4 text-center">
          {steps.map((s) => (
            <div className="col-md-4" key={s.title}>
              <div className="step-icon">{s.icon}</div>
              <h6 className="fw-bold">{s.title}</h6>
              <p className="text-muted small">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="my-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold mb-0">Recently shared</h3>
          <Link to="/browse">View all →</Link>
        </div>

        <ErrorMsg message={error} />
        {loading ? (
          <SkeletonGrid count={4} />
        ) : books.length === 0 && !error ? (
          <p className="text-muted">No books yet. Be the first to <Link to="/register">share one</Link>!</p>
        ) : (
          <div className="row g-4">
            {books.map((b, i) => (
              <div className="col-12 col-sm-6 col-lg-3" key={b.id}>
                <BookCard book={b} index={i} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
