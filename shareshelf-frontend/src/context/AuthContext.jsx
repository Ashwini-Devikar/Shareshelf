import { createContext, useContext, useState } from "react";
import { api, TOKEN_KEY, USER_KEY } from "../api/client";

const AuthContext = createContext(null);

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

function saveSession(data) {
  const user = { id: data.id, name: data.name, email: data.email, role: data.role, city: data.city };
  try {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    /* storage blocked: session lasts until refresh */
  }
  return user;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  const login = async (email, password) => {
    const data = await api("/api/auth/login", { method: "POST", body: { email, password }, auth: false });
    setUser(saveSession(data));
  };

  const register = async ({ name, email, password, city }) => {
    const data = await api("/api/auth/register", {
      method: "POST",
      body: { name, email, password, city },
      auth: false,
    });
    setUser(saveSession(data));
  };

  const logout = () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      /* ignore */
    }
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
