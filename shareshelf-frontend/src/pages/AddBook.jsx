import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { genres } from "../data/genres";
import { ErrorMsg } from "../components/Status";
import BookCover from "../components/BookCover";
import { useUI } from "../context/UIContext";
import { api } from "../api/client";
import { useGame } from "../context/GameContext";

const conditions = ["NEW", "GOOD", "FAIR", "WORN"];

export default function AddBook() {
  const navigate = useNavigate();
  const { toast } = useUI();
  const { track } = useGame();
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: genres[0],
    condition: "GOOD",
    description: "",
    coverUrl: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) {
      setError("Title and author are required.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await api("/api/books", { method: "POST", body: { ...form, coverUrl: form.coverUrl.trim() || null } });
      track("share");
      toast(`"${form.title.trim()}" added to your shelf`);
      navigate("/my-shelf");
    } catch (err) {
      setError(err.message);
      toast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // Live preview: same component the cards use, so it falls back to a colour if the link is broken
  const preview = { id: 1, title: form.title || "Your book title", coverUrl: form.coverUrl.trim() };

  return (
    <div className="row justify-content-center my-4 g-4">
      <div className="col-12 col-lg-7">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4">
            <h3 className="fw-bold mb-4">Add a book to your shelf</h3>

            <ErrorMsg message={error} />

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
                <label className="form-label">Cover image link (optional)</label>
                <input
                  name="coverUrl"
                  type="url"
                  className="form-control"
                  placeholder="https://example.com/cover.jpg"
                  value={form.coverUrl}
                  onChange={handleChange}
                />
                <div className="form-text">Paste a direct link to an image. The preview updates as you type.</div>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea name="description" rows={3} className="form-control" value={form.description} onChange={handleChange} />
              </div>
              <button className="btn btn-brand" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Add Book"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-4">
        <div className="position-sticky" style={{ top: 90 }}>
          <p className="text-muted small mb-2">Preview</p>
          <BookCover book={preview} height={300} className="rounded-4 shadow" />
        </div>
      </div>
    </div>
  );
}
