export function SkeletonCard() {
  return (
    <div className="card book-card h-100" aria-hidden="true">
      <div className="skeleton" style={{ height: 200, borderRadius: 0 }} />
      <div className="card-body">
        <div className="skeleton skeleton-line" style={{ width: "35%" }} />
        <div className="skeleton skeleton-line" style={{ width: "85%", height: 16 }} />
        <div className="skeleton skeleton-line" style={{ width: "55%" }} />
        <div className="skeleton" style={{ height: 31, marginTop: "1.2rem" }} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="row g-4" role="status" aria-label="Loading books">
      {Array.from({ length: count }, (_, i) => (
        <div className="col-12 col-sm-6 col-lg-3" key={i}>
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
}
