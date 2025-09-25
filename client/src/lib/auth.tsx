// Client-side authentication hooks and context - referenced by javascript_auth_all_persistance integration
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User } from "@shared/schema";

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email?: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is already logged in
    fetch("/api/user", { credentials: "include" })
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        setUser(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (username: string, password: string) => {
    const response = await apiRequest("POST", "/api/login", { username, password });
    if (response.ok) {
      const data = await response.json();
      setUser(data);
      queryClient.invalidateQueries();
      setLocation("/admin");
    } else {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }
  };

  const register = async (username: string, password: string, email?: string) => {
    const response = await apiRequest("POST", "/api/register", { username, password, email });
    if (response.ok) {
      const data = await response.json();
      setUser(data);
      queryClient.invalidateQueries();
      setLocation("/admin");
    } else {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }
  };

  const logout = async () => {
    const response = await apiRequest("POST", "/api/logout", {});
    if (response.ok) {
      setUser(null);
      queryClient.invalidateQueries();
      setLocation("/");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Component to protect routes that require authentication
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}