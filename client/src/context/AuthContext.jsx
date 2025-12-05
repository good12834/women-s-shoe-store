import { createContext, useState, useEffect, useContext } from "react";
import apiRequest from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verify token and get user data
        const response = await apiRequest("/users/me", {
          headers: {
            "x-auth-token": token,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Error loading user:", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const response = await apiRequest("/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || "Login failed");
    }

    localStorage.setItem("token", data.token);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const register = async (name, email, password) => {
    const response = await apiRequest("/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || "Registration failed");
    }

    localStorage.setItem("token", data.token);
    // Register endpoint returns token, we might need to fetch user or just set basic info
    // For now, let's assume we need to fetch user details or just set isAuthenticated
    // Ideally register should return user data too, or we call loadUser/me

    // Let's manually set user if returned, or fetch me
    if (data.token) {
      const meResponse = await apiRequest("/users/me", {
        headers: { "x-auth-token": data.token },
      });
      if (meResponse.ok) {
        const userData = await meResponse.json();
        setUser(userData);
        setIsAuthenticated(true);
      }
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
