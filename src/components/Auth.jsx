import React, { useState } from 'react';
import { Lock, User, ArrowRight } from 'lucide-react';

const Auth = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [mpin, setMpin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    if (mpin.length < 4) {
      setError('MPIN must be at least 4 digits');
      return;
    }

    // Pass the user info back to App
    onLogin({ username, mpin });
  };

  return (
    <div className="auth-overlay">
      <div className="glass-card auth-card animate-fade-in">
        <div className="auth-header">
          <div className="logo-glow">
            <Lock className="lock-icon" size={32} />
          </div>
          <h1>Expense Pro</h1>
          <p>Secure Voice-Enabled Finance Manager</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label htmlFor="username">Username</label>
            <div className="auth-input-wrapper">
              <User size={18} className="auth-input-icon" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="mpin">MPIN</label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                id="mpin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={mpin}
                onChange={(e) => setMpin(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 4-6 digit MPIN"
              />
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary auth-btn">
            Unlock Wallet <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          <p>April 2026 - March 2027 Dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
