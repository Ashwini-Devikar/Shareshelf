import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { genres } from "../data/genres";
import { Loading, ErrorMsg } from "../components/Status";
import BookCover from "../components/BookCover";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";

const conditions = ["NEW", "GOOD", "FAIR", "WORN"];

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useUI();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api(`/api/books/${id}`, { auth: false })
      .then((b) => {
        if (b.ownerId !== user.id) {
          setLoadError("You can only edit your own books.");
          return;
        }
        setForm({
          title: b.title || "",
          author: b.author || "",
          genre: b.genre || genres[0],
          condition: b.condition || "GOOD",
          description: b.description || "",
          coverUrl: b.coverUrl || "",
        });
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [id, user.id]);

  if (loading) return <Loading />;

  if (loadError || !form) {
    return (
      <div className="text-center my-5">
        <p>{loadError || "Book not found."}</p>
        <Link to="/my-shelf">Back to My Shelf</Link>
      </div>
    );
  }

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
      await api(`/api/books/${id}`, {
        method: "PUT",
        body: { ...form, coverUrl: form.coverUrl.trim() || null },
      });
      toast(`"${form.title.trim()}" updated`);
      navigate("/my-shelf");
    } catch (err) {
      setError(err.message);
      toast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const preview = { id: Number(id), title: form.title || "Your book title", coverUrl: form.coverUrl.trim() };

  return (
    <div className="row justify-content-center my-4 g-4">
      <div className="col-12 col-lg-7">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4">
            <h3 className="fw-bold mb-4">Edit book</h3>

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
                    {!genres.includes(form.genre) && <option>{form.genre}</option>}
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
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea name="description" rows={3} className="form-control" value={form.description} onChange={handleChange} />
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-brand" type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <Link to="/my-shelf" className="btn btn-outline-secondary">Cancel</Link>
              </div>
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
