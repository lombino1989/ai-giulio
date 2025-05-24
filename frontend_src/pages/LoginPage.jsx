import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-center text-primary mb-6">Login</h2>
          {error && <div className="alert alert-error shadow-lg p-3 mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit}>
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
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text text-neutral">Password</span>
              </label>
              <input
                type="password"
                placeholder="********"
                className="input input-bordered w-full focus:ring-primary focus:border-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <button type="submit" className="btn btn-primary w-full disabled:opacity-75" disabled={isLoading}>
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>
          <p className="text-center mt-4 text-neutral">
            Non hai un account?{' '}
            <Link to="/register" className="link link-secondary">
              Registrati
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
