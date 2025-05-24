import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(false); // For UI feedback
  const [initialLoading, setInitialLoading] = useState(true); // For checking token on app load
  const navigate = useNavigate();

  const performLogout = React.useCallback(() => {
    localStorage.removeItem('authToken');
    setToken(null);
    setCurrentUser(null);
    navigate('/login', { replace: true }); // Redirect to login on logout
    console.log('User logged out due to auth error or explicit logout.');
  }, [navigate]);

  useEffect(() => {
    const handleAuthError = () => {
      console.log("AuthContext: Received auth-error-logout event.");
      performLogout();
    };
    window.addEventListener('auth-error-logout', handleAuthError);

    // Initial token check
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      // Minimal validation: decode and check expiry if possible, or just assume valid for now
      // For a real app, you'd verify the token with a backend endpoint or decode and check expiry
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1])); // Decode JWT payload
        if (payload.exp * 1000 > Date.now()) {
          setCurrentUser({ 
            id: payload.user_id, 
            name: payload.name, 
            email: payload.email 
          });
          setToken(storedToken);
        } else {
          localStorage.removeItem('authToken'); // Token expired
          setToken(null);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error decoding token on initial load:", error);
        localStorage.removeItem('authToken');
        setToken(null);
        setCurrentUser(null);
      }
    }
    setInitialLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
      setCurrentUser(data.user); // Assuming API returns user object {id, name, email}
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/register', { // Using fetch directly as it's a public endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      // Automatically log in the user after successful registration
      const loginResult = await login(email, password); // Call existing login function
      if (loginResult.success) {
        setIsLoading(false);
        // The user is now logged in, AuthContext state is updated by login()
        // The navigate() call will be handled by the component calling register based on this success
        return { success: true, message: 'Registrazione e login avvenuti con successo!', user: currentUser }; 
      } else {
        // Login after registration failed, this is an edge case
        setIsLoading(false);
        // User is registered but not logged in. Navigate to login page.
        return { success: true, message: 'Registrazione avvenuta. Effettua il login.', user: data.user, autoLoginError: loginResult.error };
      }
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  };

  const logout = () => { // This is the explicit logout function for user interaction
    performLogout();
    // Optionally, navigate to home or login page if not already handled by performLogout
    // navigate('/'); 
  };

  return (
    <AuthContext.Provider value={{ currentUser, token, isLoading, initialLoading, login, register, logout: performLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Note: The `logout` function provided by the context is now `performLogout`.
// If `Navbar.jsx` (or other components) call `logout()`, they will now trigger `performLogout`.
