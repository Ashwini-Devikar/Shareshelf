import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ErrorMsg } from "../components/Status";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", city: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Name, email and password are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, city: form.city });
      navigate("/my-shelf");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center my-5">
      <div className="col-12 col-md-7 col-lg-5">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4">
            <h3 className="fw-bold text-center mb-4">Create your account</h3>

            <ErrorMsg message={error} />

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full name</label>
                <input name="name" className="form-control" value={form.name} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">City</label>
                <input name="city" className="form-control" value={form.city} onChange={handleChange} />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Confirm password</label>
                  <input type="password" name="confirm" className="form-control" value={form.confirm} onChange={handleChange} />
                </div>
              </div>
              <button className="btn btn-brand w-100" type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            <p className="text-center text-muted small mt-3 mb-0">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
