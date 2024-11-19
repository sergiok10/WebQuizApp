// src/contexts/UserContext.js
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    email: localStorage.getItem("email") || null,
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    password: null, // Optional to store password here
  });

  // Sync with localStorage whenever `user` changes
  useEffect(() => {
    if (user.token) {
      localStorage.setItem("token", user.token);
      localStorage.setItem("email", user.email);
      localStorage.setItem("role", user.role);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
