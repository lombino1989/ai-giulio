import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading } = useAuth();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // To redirect to 'from' location if applicable
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Tutti i campi sono obbligatori.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Le password non coincidono.');
      return;
    }
    if (password.length < 6) {
        setError('La password deve contenere almeno 6 caratteri.');
        return;
    }

    const result = await register(name, email, password);
    if (result.success) {
      // If registration and auto-login were successful
      if (result.user && !result.autoLoginError) {
        setSuccessMessage(result.message || 'Registrazione e login avvenuti con successo!');
        navigate(from, { replace: true }); // Redirect to 'from' or home
      } else if (result.autoLoginError) {
        // Registered but auto-login failed
        setSuccessMessage(`${result.message} Auto-login fallito: ${result.autoLoginError}`);
        setTimeout(() => {
          navigate('/login'); // Redirect to login page
        }, 3000);
      } else {
         // Registered, but no user object returned (should not happen with current AuthContext logic)
        setSuccessMessage(result.message || 'Registrazione avvenuta con successo! Effettua il login.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } else {
      setError(result.error || 'Registrazione fallita. Riprova.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] bg-base-200">
      <div className="card w-full max-w-lg shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-center text-primary mb-6">Registrati</h2>
          {error && <div className="alert alert-error shadow-lg p-3 mb-4 text-sm">{error}</div>}
          {successMessage && <div className="alert alert-success shadow-lg p-3 mb-4 text-sm">{successMessage}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-neutral">Nome Completo</span>
              </label>
              <input
                type="text"
                placeholder="Mario Rossi"
                className="input input-bordered w-full focus:ring-primary focus:border-primary"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-neutral">Email</span>
              </label>
              <input
                type="email"
                placeholder="tuamail@esempio.com"
                className="input input-bordered w-full focus:ring-primary focus:border-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-neutral">Password</span>
              </label>
              <input
                type="password"
                placeholder="******** (min. 6 caratteri)"
                className="input input-bordered w-full focus:ring-primary focus:border-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text text-neutral">Conferma Password</span>
              </label>
              <input
                type="password"
                placeholder="********"
                className="input input-bordered w-full focus:ring-primary focus:border-primary"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <button type="submit" className="btn btn-primary w-full disabled:opacity-75" disabled={isLoading}>
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  'Registrati'
                )}
              </button>
            </div>
          </form>
          <p className="text-center mt-4 text-neutral">
            Hai già un account?{' '}
            <Link to="/login" className="link link-secondary">
              Accedi
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
