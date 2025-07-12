import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Define the user type
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role?: string;
}

// Define return type
interface UseAuthHook {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  signInUsingEmailPassword: (email: string, password: string) => Promise<void>;
  signInUsingGoogle: () => void;
  signInUsingGithub: () => void;
  signOut: () => void;
}

export function useAuth(): UseAuthHook {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:8000/api/v1/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const signInUsingEmailPassword = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/v1/users/signin", { email, password });
      const { jwt, user } = res.data;

      localStorage.setItem("token", jwt);
      setUser(user);
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signInUsingGoogle = useCallback(() => {
    const redirectUri = encodeURIComponent("http://localhost:5173/oauth/callback");
    window.location.href = `http://localhost:8000/api/v1/auth/oauth/google?redirect_uri=${redirectUri}`;
  }, []);

  const signInUsingGithub = useCallback(() => {
    console.log("hello from callback")
    const redirectUri = encodeURIComponent("http://localhost:5173/oauth/callback");
    window.location.href = `http://localhost:8000/api/v1/auth/oauth/github?redirect_uri=${redirectUri}`;
  }, []);




  const signOut = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  return {
    user,
    isLoggedIn: !!user,
    loading,
    signInUsingEmailPassword,
    signInUsingGoogle,
    signInUsingGithub,
    signOut,
  };
}
