import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { ErrorMsg } from "../components/Status";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useUI();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/my-shelf";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast("Welcome back!");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center my-5">
      <div className="col-12 col-md-6 col-lg-4">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4">
            <h3 className="fw-bold text-center mb-4">Welcome back</h3>

            <ErrorMsg message={error} />

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} />
              </div>
              <button className="btn btn-brand w-100" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-center text-muted small mt-3 mb-0">
              New here? <Link to="/register">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
