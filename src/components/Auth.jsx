import React, { useState } from 'react';
import { Lock, User, ArrowRight, UserPlus, HelpCircle, Eye, EyeOff } from 'lucide-react';

const Auth = ({ onLogin, onRegister, users }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [mpin, setMpin] = useState('');
  const [showMpin, setShowMpin] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    if (mpin.length < 4) {
      setError('MPIN must be at least 4 digits');
      return;
    }

    const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (isLogin) {
      // Login Logic
      if (!existingUser) {
        setError('Username not found. Please Sign Up or check the spelling.');
        return;
      }
      if (existingUser.mpin !== mpin) {
        setError('Incorrect MPIN. Please try again.');
        return;
      }
      onLogin(existingUser);
    } else {
      // Signup Logic
      if (existingUser) {
        setError('Username already exists. Please pick another or log in.');
        return;
      }
      const newUser = {
        username,
        mpin,
        createdAt: new Date().toISOString()
      };
      onRegister(newUser);
    }
  };

  const handleResetRequest = () => {
    if (!username.trim()) {
      setError('Enter your username first to retrieve MPIN');
      return;
    }
    const found = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (found) {
      alert(`Reminder for ${found.username}: Your MPIN is ${found.mpin}\n(Registered on: ${new Date(found.createdAt).toLocaleString()})`);
    } else {
      setError('Username not found');
    }
  };

  return (
    <div className="auth-overlay">
      <div className="glass-card auth-card animate-fade-in">
        <div className="auth-header">
          <div className="logo-glow">
            {isLogin ? <Lock className="lock-icon" size={32} /> : <UserPlus className="lock-icon" size={32} />}
          </div>
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p>{isLogin ? 'Login to access your wallet' : 'Start your financial journey today'}</p>
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
            <label htmlFor="mpin">MPIN ({isLogin ? 'Required' : 'Set New'})</label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                id="mpin"
                type={showMpin ? "text" : "password"}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={mpin}
                onChange={(e) => setMpin(e.target.value.replace(/\D/g, ''))}
                placeholder="4-6 digit numeric pin"
              />
              <button 
                type="button" 
                onClick={() => setShowMpin(!showMpin)}
                className="mpin-toggle"
              >
                {showMpin ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="auth-error-container">
              <p className="auth-error">{error}</p>
            </div>
          )}

          <button type="submit" className="btn-primary auth-btn">
            {isLogin ? 'Unlock Wallet' : 'Register & Login'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer-actions">
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)} 
            className="switch-btn"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </button>
          
          {isLogin && (
            <button 
              type="button" 
              onClick={handleResetRequest}
              className="forgot-btn"
            >
              <HelpCircle size={14} /> Forgot MPIN?
            </button>
          )}
        </div>

        <div className="auth-metadata">
          <p>Expense Pro v1.2 • Secure Offline Vault</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
