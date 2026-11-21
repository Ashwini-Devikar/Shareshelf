import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useUI } from "../context/UIContext";
import PlayerBar from "./PlayerBar";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle, arcade, toggleArcade, sound, toggleSound } = useTheme();
  const { toast } = useUI();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast("You have been logged out", "info");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-glass border-bottom sticky-top">
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
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={(e) => e.preventDefault()}
                >
                  My Space
                </a>
                <ul className="dropdown-menu">
                  <li><NavLink className="dropdown-item" to="/quests">🏆 Quest Log</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/dashboard">📊 Dashboard</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/my-shelf">📚 My Shelf</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/wishlist">♥ Wishlist</NavLink></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><NavLink className="dropdown-item" to="/my-requests">📤 My Requests</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/received-requests">📥 Received Requests</NavLink></li>
                </ul>
              </li>
            )}
          </ul>

          <div className="d-flex gap-2 align-items-center flex-wrap">
            {user && <PlayerBar />}

            <button
              type="button"
              className={`theme-toggle ${arcade ? "on" : ""}`}
              onClick={toggleArcade}
              aria-pressed={arcade}
              aria-label="Toggle arcade mode"
              title={arcade ? "Arcade mode: on" : "Arcade mode: off"}
            >
              🎮
            </button>
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleSound}
              aria-pressed={sound}
              aria-label="Toggle sound effects"
              title={sound ? "Sound: on" : "Sound: off"}
            >
              {sound ? "🔊" : "🔇"}
            </button>
            <button
              type="button"
              className="theme-toggle"
              onClick={toggle}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {user ? (
              <button className="btn btn-outline-brand" onClick={handleLogout}>Logout</button>
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
