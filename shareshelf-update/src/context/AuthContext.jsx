import { createContext, useContext, useState } from "react";

// Mock auth for Week 1. In Week 3 this will call /api/auth/login and store the JWT.
const AuthContext = createContext(null);

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem("shareshelf_user"));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  const login = (email, name) => {
    const u = { id: 100, name: name || email.split("@")[0], email, role: "USER" };
    localStorage.setItem("shareshelf_user", JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("shareshelf_user");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
