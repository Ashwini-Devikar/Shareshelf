import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useUI } from "../context/UIContext";
import { useGame } from "../context/GameContext";

export default function WishlistButton({ bookId }) {
  const { user } = useAuth();
  const { has, toggle } = useWishlist();
  const { toast } = useUI();
  const { track } = useGame();
  const navigate = useNavigate();
  const saved = has(bookId);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast("Log in to save books to your wishlist", "info");
      navigate("/login");
      return;
    }
    const added = toggle(bookId);
    if (added) track("wish");
    toast(added ? "Saved to your wishlist" : "Removed from your wishlist", added ? "success" : "info");
  };

  return (
    <button
      type="button"
      className={`wish-btn ${saved ? "active" : ""}`}
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      title={saved ? "Remove from wishlist" : "Add to wishlist"}
    >
      {saved ? "♥" : "♡"}
    </button>
  );
}
