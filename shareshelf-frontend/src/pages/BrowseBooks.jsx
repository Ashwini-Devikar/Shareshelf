import { useMemo, useState } from "react";
import BookCard from "../components/BookCard";
import SearchBar from "../components/SearchBar";
import { mockBooks } from "../data/mockBooks";

export default function BrowseBooks() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockBooks.filter((b) => {
      const matchesText = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      const matchesGenre = !genre || b.genre === genre;
      const matchesStatus = !onlyAvailable || b.status === "AVAILABLE";
      return matchesText && matchesGenre && matchesStatus;
    });
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

      <p className="text-muted small">{results.length} book(s) found</p>

      {results.length === 0 ? (
        <div className="text-center text-muted py-5">No books match your search.</div>
      ) : (
        <div className="row g-4">
          {results.map((b) => (
            <div className="col-12 col-sm-6 col-lg-3" key={b.id}>
              <BookCard book={b} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
