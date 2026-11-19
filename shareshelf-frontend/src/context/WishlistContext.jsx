import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

// Wishlist is saved in this browser, separately for each logged-in user.
const WishlistContext = createContext(null);

function read(key) {
  if (!key) return [];
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const key = user ? `shareshelf_wishlist_${user.id}` : null;
  const [ids, setIds] = useState(() => read(key));

  // Switch lists when a different user logs in or out
  useEffect(() => {
    setIds(read(key));
  }, [key]);

  const has = (id) => ids.includes(id);

  // Returns true if the book was added, false if it was removed
  const toggle = (id) => {
    const added = !ids.includes(id);
    const next = added ? [...ids, id] : ids.filter((x) => x !== id);
    setIds(next);
    if (key) {
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    }
    return added;
  };

  return <WishlistContext.Provider value={{ ids, has, toggle }}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
