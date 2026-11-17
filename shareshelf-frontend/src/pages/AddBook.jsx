import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { genres } from "../data/mockBooks";

const conditions = ["NEW", "GOOD", "FAIR", "WORN"];

export default function AddBook() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: genres[0],
    condition: "GOOD",
    description: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) {
      setError("Title and author are required.");
      return;
    }
    setError("");
    // Week 3: POST /api/books
    alert(`"${form.title}" added (mock). Backend comes in Week 3.`);
    navigate("/my-shelf");
  };

  return (
    <div className="row justify-content-center my-4">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4">
            <h3 className="fw-bold mb-4">Add a book to your shelf</h3>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input name="title" className="form-control" value={form.title} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Author</label>
                <input name="author" className="form-control" value={form.author} onChange={handleChange} />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Genre</label>
                  <select name="genre" className="form-select" value={form.genre} onChange={handleChange}>
                    {genres.map((g) => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Condition</label>
                  <select name="condition" className="form-select" value={form.condition} onChange={handleChange}>
                    {conditions.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea name="description" rows={3} className="form-control" value={form.description} onChange={handleChange} />
              </div>
              <button className="btn btn-brand" type="submit">Add Book</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
