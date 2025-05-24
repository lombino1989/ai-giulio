import { jwtDecode } from 'jwt-decode'; // Using a library for robust decoding

const API_BASE_URL = '/api'; // Adjust if your API is hosted elsewhere

// Function to get the token and user from localStorage
const getAuthData = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    try {
      const decodedToken = jwtDecode(token); // Using jwt-decode
      // Check if token is expired
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('authToken');
        // Potentially trigger a logout event or redirect here if context is available
        // For now, just removing token, subsequent calls will fail or AuthContext will handle it.
        console.warn('Token expired, removed from localStorage.');
        return { token: null, user: null };
      }
      // The payload structure depends on what you stored during login
      return { 
        token, 
        user: { 
          id: decodedToken.user_id, 
          name: decodedToken.name, 
          email: decodedToken.email 
        } 
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem('authToken'); // Invalid token
      return { token: null, user: null };
    }
  }
  return { token: null, user: null };
};


const apiRequest = async (endpoint, method = 'GET', body = null, requiresAuth = true) => {
  const { token } = getAuthData();
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  if (requiresAuth) {
    if (!token) {
      // This case should ideally be handled by redirecting to login via AuthContext or ProtectedRoute
      // Or, if AuthContext is accessible here, call logout.
      // For now, throw an error that can be caught by the calling component.
      // window.dispatchEvent(new Event('auth-error-logout')); // One way to signal global logout
      console.error('Authentication token is missing for protected route.');
      throw new Error('Autenticazione richiesta. Effettua il login.');
    }
    headers.append('Authorization', `Bearer ${token}`);
  }

  const config = {
    method,
    headers,
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (response.status === 401 && requiresAuth) {
      // Unauthorized - token might be invalid or expired on the server side
      localStorage.removeItem('authToken');
      // Dispatch a custom event to notify AuthContext or App to handle logout
      // This helps avoid direct import of navigate or AuthContext here.
      window.dispatchEvent(new Event('auth-error-logout')); 
      throw new Error('Sessione scaduta o non valida. Effettua nuovamente il login.');
    }

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || `Errore API: ${response.status}`);
    }
    return responseData;
  } catch (error) {
    console.error(`API request failed: ${method} ${endpoint}`, error);
    throw error; // Re-throw to be caught by the calling component
  }
};

export { apiRequest, getAuthData };

// Helper to subscribe to the auth-error-logout event in AuthContext or App.jsx
// Example in AuthContext.jsx:
// useEffect(() => {
//   const handleAuthError = () => logout(); // Or a more specific logout action
//   window.addEventListener('auth-error-logout', handleAuthError);
//   return () => window.removeEventListener('auth-error-logout', handleAuthError);
// }, [logout]);
