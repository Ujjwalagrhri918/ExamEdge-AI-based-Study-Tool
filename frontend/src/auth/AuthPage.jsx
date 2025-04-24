import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './AuthPage.css';

/**
 * AuthPage component that handles both Login and Signup
 * Provides email/password and Google auth options
 */
export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles form submission for both login and signup
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isSignup && password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(
        isSignup
          ? 'Failed to create an account. Please try again.'
          : 'Failed to log in. Please check your credentials.'
      );
    }
  };

  /**
   * Handles Google sign-in/signup
   */
  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      setError(
        isSignup
          ? 'Failed to sign up with Google. Please try again.'
          : 'Failed to sign in with Google. Please try again.'
      );
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {isSignup && (
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}
        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
      </form>

      <div className="divider">
        <span>OR</span>
      </div>

      <button className="google-btn" onClick={handleGoogleAuth}>
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google logo"
          className="google-icon"
        />
        {isSignup ? 'Sign up with Google' : 'Sign in with Google'}
      </button>

      <p className="auth-link">
        {isSignup
          ? 'Already have an account? '
          : "Don't have an account? "}
        <button
          type="button"
          onClick={() => {
            setError('');
            setIsSignup(!isSignup);
          }}
          className="link-btn"
        >
          {isSignup ? 'Login' : 'Sign up'}
        </button>
      </p>
    </div>
  );
}
