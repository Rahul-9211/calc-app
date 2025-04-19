import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, User } from '@/types/auth';

// Sample users for demonstration
const USERS = [
  { username: 'admin', password: 'admin123' },
  { username: 'user', password: 'user123' },
];

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on startup
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem('@user');
        if (userJson) {
          setUser(JSON.parse(userJson));
        }
      } catch (error) {
        console.error('Failed to load user from storage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (username: string, password: string): Promise<boolean> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const foundUser = USERS.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      const userData: User = {
        username: foundUser.username,
        isAuthenticated: true,
      };
      
      setUser(userData);
      
      try {
        await AsyncStorage.setItem('@user', JSON.stringify(userData));
      } catch (error) {
        console.error('Failed to save user to storage:', error);
      }
      
      return true;
    }
    
    return false;
  };

  const signOut = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem('@user');
    } catch (error) {
      console.error('Failed to remove user from storage:', error);
    }
  };

  if (loading) {
    return null; // You could return a loading screen here
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};