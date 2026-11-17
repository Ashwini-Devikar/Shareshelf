import { useState } from "react";
import { Link } from "react-router-dom";
import BookCard from "../components/BookCard";
import { myBooks } from "../data/mockUser";

export default function MyShelf() {
  const [books, setBooks] = useState(myBooks);

  const handleDelete = (id) => {
    if (window.confirm("Remove this book from your shelf?")) {
      // Week 3: DELETE /api/books/{id}
      setBooks(books.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold mb-0">My Shelf</h2>
        <Link to="/add-book" className="btn btn-brand">+ Add Book</Link>
      </div>

      {books.length === 0 ? (
        <div className="text-center text-muted py-5">
          Your shelf is empty. <Link to="/add-book">Add your first book</Link>.
        </div>
      ) : (
        <div className="row g-4">
          {books.map((b) => (
            <div className="col-12 col-sm-6 col-lg-3" key={b.id}>
              <div className="d-flex flex-column h-100">
                <BookCard book={b} />
                <button
                  className="btn btn-outline-danger btn-sm mt-2"
                  onClick={() => handleDelete(b.id)}
                >
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
