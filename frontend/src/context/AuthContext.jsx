import { createContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, logoutUser, refreshSession } from "../api/auth";
import { setAccessToken } from "../api/axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]            = useState(null);
  const [isCheckingSession, setIsChecking] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const data = await refreshSession();
        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch {
        // No valid cookie — user is just not logged in, that's fine
        // Do NOT redirect here — ProtectedRoute handles that
        setAccessToken(null);
        setUser(null);
      } finally {
        // Always set to false so the spinner stops
        setIsChecking(false);
      }
    };
    restore();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginUser(email, password);
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (email, password) => {
    const data = await registerUser(email, password);
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try { await logoutUser(); } catch { }
    setAccessToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isCheckingSession,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};