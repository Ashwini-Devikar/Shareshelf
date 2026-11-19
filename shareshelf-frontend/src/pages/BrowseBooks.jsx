import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import SearchBar from "../components/SearchBar";
import { SkeletonGrid } from "../components/Skeleton";
import { ErrorMsg } from "../components/Status";
import { api } from "../api/client";

export default function BrowseBooks() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    // Wait 300 ms after the last keystroke before calling the API
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (genre) params.set("genre", genre);
      if (onlyAvailable) params.set("available", "true");

      api(`/api/books?${params.toString()}`, { auth: false })
        .then((data) => {
          if (!cancelled) {
            setBooks(data);
            setError("");
          }
        })
        .catch((err) => {
          if (!cancelled) setError(err.message);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, genre, onlyAvailable]);

  return (
    <div className="my-4">
      <h2 className="fw-bold mb-3">Browse Books</h2>

      <SearchBar
        query={query}
        setQuery={setQuery}
        genre={genre}
        setGenre={setGenre}
        onlyAvailable={onlyAvailable}
        setOnlyAvailable={setOnlyAvailable}
      />

      <ErrorMsg message={error} />

      {loading ? (
        <SkeletonGrid count={8} />
      ) : (
        <>
          <p className="text-muted small">{books.length} book(s) found</p>
          {books.length === 0 ? (
            <div className="text-center text-muted py-5">
              <div className="display-4">🔍</div>
              No books match your search.
            </div>
          ) : (
            <div className="row g-4">
              {books.map((b, i) => (
                <div className="col-12 col-sm-6 col-lg-3" key={b.id}>
                  <BookCard book={b} index={i} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
