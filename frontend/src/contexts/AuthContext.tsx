import React, { createContext, useContext, useState, ReactNode } from 'react';

const mockUser = {
  id: 'user1',
  username: 'sarah_codes',
  avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=150',
  xp: 4250,
};

interface User {
  id: string;
  username: string;
  avatar: string;
  xp: number;
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(mockUser); // You can change mock logic later

  const login = () => setUser(mockUser);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
