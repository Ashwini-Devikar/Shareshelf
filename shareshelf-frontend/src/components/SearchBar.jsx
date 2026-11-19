import { genres } from "../data/genres";

export default function SearchBar({ query, setQuery, genre, setGenre, onlyAvailable, setOnlyAvailable }) {
  return (
    <div className="row g-2 align-items-center mb-4">
      <div className="col-12 col-md-5">
        <input
          type="text"
          className="form-control"
          placeholder="Search by title or author..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="col-6 col-md-3">
        <select className="form-select" value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="col-6 col-md-4">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="onlyAvailable"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="onlyAvailable">
            Available only
          </label>
        </div>
      </div>
    </div>
  );
}
