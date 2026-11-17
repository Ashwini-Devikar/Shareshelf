import { Link } from "react-router-dom";
import BookCard from "../components/BookCard";
import { mockBooks } from "../data/mockBooks";

const steps = [
  { icon: "📚", title: "List your books", text: "Add the books you've finished to your virtual shelf." },
  { icon: "🔎", title: "Find a book", text: "Search by title, author or genre and see who has it." },
  { icon: "🤝", title: "Borrow & return", text: "Send a request, get approved, and return by the due date." },
];

export default function Home() {
  const featured = mockBooks.filter((b) => b.status === "AVAILABLE").slice(0, 4);

  return (
    <>
      <section className="hero p-4 p-md-5 my-4 text-center">
        <h1 className="display-5 fw-bold">Share books. Read more. Spend less.</h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: 600 }}>
          ShareShelf connects readers who have books sitting idle with people who want to read them.
        </p>
        <div className="d-flex justify-content-center gap-2 mt-3">
          <Link to="/browse" className="btn btn-brand btn-lg">Browse Books</Link>
          <Link to="/register" className="btn btn-outline-brand btn-lg">Start Sharing</Link>
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
        <div className="row g-4">
          {featured.map((b) => (
            <div className="col-12 col-sm-6 col-lg-3" key={b.id}>
              <BookCard book={b} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
