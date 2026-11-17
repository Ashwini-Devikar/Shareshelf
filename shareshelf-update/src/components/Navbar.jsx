import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          📚 Share<span>Shelf</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/browse">Browse Books</NavLink>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/my-shelf">My Shelf</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/my-requests">My Requests</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/received-requests">Received</NavLink>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex gap-2 align-items-center">
            {user ? (
              <>
                <span className="text-muted small">Hi, {user.name}</span>
                <button className="btn btn-outline-brand" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-brand">Login</Link>
                <Link to="/register" className="btn btn-brand">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
