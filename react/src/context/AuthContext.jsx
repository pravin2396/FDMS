import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

// Pre-seeded default users for immediate testing
const DEFAULT_USERS = [
  {
    id: 'user_1',
    name: 'Pravin',
    username: 'pravin',
    email: 'pravin@foodcourt.com',
    password: 'Password123!',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'user_2',
    name: 'Alex Johnson',
    username: 'alex',
    email: 'alex@foodcourt.com',
    password: 'Password123!',
    role: 'Customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      // 1. Clear any old/previous project data from localStorage, keeping only 'fdms_' keys
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !key.startsWith('fdms_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));

      // 2. Ensure registered users exist and admin is Pravin
      const storedUsers = localStorage.getItem('fdms_users');
      if (!storedUsers) {
        localStorage.setItem('fdms_users', JSON.stringify(DEFAULT_USERS));
      } else {
        try {
          const parsed = JSON.parse(storedUsers);
          const updated = parsed.map((u) =>
            u.role === 'Admin' || u.id === 'user_1' || u.username === 'admin'
              ? {
                  ...u,
                  name: 'Pravin',
                  username: 'pravin',
                  email: 'pravin@foodcourt.com',
                }
              : u
          );
          if (!updated.some((u) => u.username === 'pravin')) {
            updated.unshift(DEFAULT_USERS[0]);
          }
          localStorage.setItem('fdms_users', JSON.stringify(updated));
        } catch {
          localStorage.setItem('fdms_users', JSON.stringify(DEFAULT_USERS));
        }
      }

      // 3. Ensure active session (if any) reflects Pravin for the admin role
      const storedSession = localStorage.getItem('fdms_user_session');
      if (storedSession) {
        try {
          const sess = JSON.parse(storedSession);
          if (sess.role === 'Admin' || sess.username === 'admin') {
            sess.name = 'Pravin';
            sess.username = 'pravin';
            sess.email = 'pravin@foodcourt.com';
            localStorage.setItem('fdms_user_session', JSON.stringify(sess));
            return sess;
          }
          return sess;
        } catch {
          // fall through
        }
      }

      // Pre-seed admin session so application opens directly without blank redirection
      const hasLoggedOut = localStorage.getItem('fdms_logged_out');
      if (!hasLoggedOut) {
        const defaultAdminSession = {
          id: DEFAULT_USERS[0].id,
          name: 'Pravin',
          username: 'pravin',
          email: 'pravin@foodcourt.com',
          role: 'Admin',
          avatar: DEFAULT_USERS[0].avatar,
          token: `mock_jwt_token_${Date.now()}_admin`,
          loginAt: new Date().toISOString(),
        };
        localStorage.setItem('fdms_user_session', JSON.stringify(defaultAdminSession));
        return defaultAdminSession;
      }
      return null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Helper to fetch all registered users
  const getUsers = () => {
    try {
      const stored = localStorage.getItem('fdms_users');
      return stored ? JSON.parse(stored) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  };

  // Login action
  const login = async (identifier, password, rememberMe = false) => {
    setLoading(true);
    // Simulate brief network latency for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 600));

    const users = getUsers();
    const cleanIdentifier = identifier.trim().toLowerCase();

    const matchedUser = users.find(
      (u) =>
        (u.username.toLowerCase() === cleanIdentifier ||
          u.email.toLowerCase() === cleanIdentifier) &&
        u.password === password
    );

    if (matchedUser) {
      const sessionData = {
        id: matchedUser.id,
        name: matchedUser.name,
        username: matchedUser.username,
        email: matchedUser.email,
        role: matchedUser.role || 'Customer',
        avatar: matchedUser.avatar,
        token: `mock_jwt_token_${Date.now()}_${matchedUser.id}`,
        loginAt: new Date().toISOString(),
      };

      setUser(sessionData);
      localStorage.setItem('fdms_user_session', JSON.stringify(sessionData));
      localStorage.removeItem('fdms_logged_out');

      if (rememberMe) {
        localStorage.setItem('fdms_remembered_username', identifier.trim());
      } else {
        localStorage.removeItem('fdms_remembered_username');
      }

      setLoading(false);
      toast.success(`Welcome back, ${matchedUser.name}!`);
      return { success: true, user: sessionData };
    } else {
      setLoading(false);
      toast.error('Invalid username or password. Please try again.');
      return { success: false, message: 'Invalid username or password' };
    }
  };

  // Register action
  const register = async (userData) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const users = getUsers();
    const cleanUsername = userData.username.trim().toLowerCase();
    const cleanEmail = userData.email.trim().toLowerCase();

    const usernameExists = users.some(
      (u) => u.username.toLowerCase() === cleanUsername
    );
    if (usernameExists) {
      setLoading(false);
      toast.error('Username already taken. Please pick another.');
      return { success: false, message: 'Username already taken' };
    }

    const emailExists = users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      setLoading(false);
      toast.error('Email is already registered. Please login.');
      return { success: false, message: 'Email already registered' };
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name: userData.name.trim(),
      username: userData.username.trim(),
      email: userData.email.trim(),
      password: userData.password,
      role: 'Customer',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('fdms_users', JSON.stringify(updatedUsers));

    // Automatically establish session upon registration
    const sessionData = {
      id: newUser.id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
      token: `mock_jwt_token_${Date.now()}_${newUser.id}`,
      loginAt: new Date().toISOString(),
    };

    setUser(sessionData);
    localStorage.setItem('fdms_user_session', JSON.stringify(sessionData));

    setLoading(false);
    toast.success('Account created successfully! Welcome to Food Court.');
    return { success: true, user: sessionData };
  };

  // Forgot password action
  const forgotPassword = async (identifier, newPassword) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const users = getUsers();
    const cleanIdentifier = identifier.trim().toLowerCase();

    const index = users.findIndex(
      (u) =>
        u.username.toLowerCase() === cleanIdentifier ||
        u.email.toLowerCase() === cleanIdentifier
    );

    if (index === -1) {
      setLoading(false);
      toast.error('No account found with this username or email.');
      return { success: false, message: 'Account not found' };
    }

    users[index].password = newPassword;
    localStorage.setItem('fdms_users', JSON.stringify(users));

    setLoading(false);
    toast.success('Password updated successfully! You can now log in.');
    return { success: true };
  };

  // Logout action
  const logout = () => {
    setUser(null);
    localStorage.removeItem('fdms_user_session');
    localStorage.setItem('fdms_logged_out', 'true');
    toast.info('You have logged out successfully.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        forgotPassword,
        logout,
        isAuthenticated: !!user,
      }}
    >
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

export default AuthContext;
