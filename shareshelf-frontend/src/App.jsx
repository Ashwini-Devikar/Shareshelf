import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import BrowseBooks from "./pages/BrowseBooks";
import BookDetails from "./pages/BookDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyShelf from "./pages/MyShelf";
import AddBook from "./pages/AddBook";
import MyRequests from "./pages/MyRequests";
import ReceivedRequests from "./pages/ReceivedRequests";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container pb-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<BrowseBooks />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/my-shelf" element={<ProtectedRoute><MyShelf /></ProtectedRoute>} />
          <Route path="/add-book" element={<ProtectedRoute><AddBook /></ProtectedRoute>} />
          <Route path="/my-requests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
          <Route path="/received-requests" element={<ProtectedRoute><ReceivedRequests /></ProtectedRoute>} />

          <Route path="*" element={<div className="text-center my-5">Page not found</div>} />
        </Routes>
      </main>
    </>
  );
}
