import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import BrowseBooks from "./pages/BrowseBooks";
import BookDetails from "./pages/BookDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Wishlist from "./pages/Wishlist";
import Quests from "./pages/Quests";
import MyShelf from "./pages/MyShelf";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import AdminPanel from "./pages/AdminPanel";
import MyRequests from "./pages/MyRequests";
import ReceivedRequests from "./pages/ReceivedRequests";

export default function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <main className="container pb-5">
        {/* key makes every page fade in when the route changes */}
        <div key={location.pathname} className="fade-up">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<BrowseBooks />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/quests" element={<ProtectedRoute><Quests /></ProtectedRoute>} />
            <Route path="/my-shelf" element={<ProtectedRoute><MyShelf /></ProtectedRoute>} />
            <Route path="/add-book" element={<ProtectedRoute><AddBook /></ProtectedRoute>} />
            <Route path="/edit-book/:id" element={<ProtectedRoute><EditBook /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
            <Route path="/my-requests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
            <Route path="/received-requests" element={<ProtectedRoute><ReceivedRequests /></ProtectedRoute>} />

            <Route path="*" element={<div className="text-center my-5">Page not found</div>} />
          </Routes>
        </div>
      </main>

      <footer className="border-top py-4 text-center text-muted small">
        📚 ShareShelf · Built with React, Spring Boot and MySQL
      </footer>
    </>
  );
}
