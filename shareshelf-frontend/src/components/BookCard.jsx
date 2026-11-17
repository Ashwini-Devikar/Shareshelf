const statusStyle = {
  AVAILABLE: "bg-success",
  REQUESTED: "bg-warning text-dark",
  BORROWED: "bg-secondary",
};

export default function BookCard({ book }) {
  const canRequest = book.status === "AVAILABLE";

  return (
    <div className="card book-card h-100">
      <div className="book-cover" style={{ background: book.color }}>
        📖
      </div>

      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <span className="badge text-bg-light border">{book.genre}</span>
          <span className={`badge ${statusStyle[book.status]}`}>{book.status}</span>
        </div>

        <h6 className="card-title fw-bold mt-2 mb-1">{book.title}</h6>
        <p className="text-muted small mb-2">by {book.author}</p>

        <p className="small text-muted mb-3">
          Owner: {book.owner} · {book.city}
          <br />
          Condition: {book.condition}
        </p>

        <button
          className="btn btn-brand btn-sm mt-auto"
          disabled={!canRequest}
          onClick={() => alert(`Borrow request for "${book.title}" (backend coming in Week 3)`)}
        >
          {canRequest ? "Request to Borrow" : "Not available"}
        </button>
      </div>
    </div>
  );
}
