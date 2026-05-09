import React, { useState } from 'react';
import { Lock, User, ArrowRight, UserPlus, HelpCircle, Eye, EyeOff, Sparkles } from 'lucide-react';

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
      if (!existingUser) {
        setError('Username not found. Please Sign Up.');
        return;
      }
      if (existingUser.mpin !== mpin) {
        setError('Incorrect MPIN. Try again.');
        return;
      }
      onLogin(existingUser);
    } else {
      if (existingUser) {
        setError('Username already exists.');
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
      setError('Enter username first');
      return;
    }
    const found = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (found) {
      alert(`Reminder for ${found.username}: Your MPIN is ${found.mpin}`);
    } else {
      setError('Username not found');
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card animate-fade-in">
        <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', background: 'var(--accent-glow)', filter: 'blur(80px)', borderRadius: '50%', opacity: 0.5 }}></div>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: 'var(--accent-gradient)', 
            borderRadius: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1.5rem',
            boxShadow: '0 15px 30px var(--accent-glow)',
            transform: 'rotate(-5deg)'
          }}>
            <Sparkles color="white" size={40} />
          </div>
          <h1 style={{ marginBottom: '0.5rem' }}>{isLogin ? 'Welcome Back' : 'Get Started'}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{isLogin ? 'Unlock your secure financial vault' : 'The most premium way to track expenses'}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="text-xs-bold" style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem', marginBottom: '0.5rem', display: 'block' }}>Username</label>
            <div className="auth-input-wrapper">
              <User size={18} className="auth-input-icon" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="eg. ambe-krushi"
                autoComplete="off"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="text-xs-bold" style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem', marginBottom: '0.5rem', display: 'block' }}>MPIN</label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
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
                style={{ right: '1rem', color: 'var(--text-secondary)' }}
              >
                {showMpin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem', borderRadius: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--error-color)', fontSize: '0.8rem', fontWeight: '600' }}>{error}</p>
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1.25rem' }}>
            {isLogin ? 'Continue to App' : 'Create My Account'} <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
          </button>
        </form>

        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ background: 'transparent', color: 'var(--accent-color)', fontWeight: '700', fontSize: '0.9rem' }}
          >
            {isLogin ? "New here? Join Premium" : "Already a member? Log In"}
          </button>
          
          {isLogin && (
            <button 
              type="button" 
              onClick={handleResetRequest}
              style={{ background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <HelpCircle size={14} /> Forgot MPIN?
            </button>
          )}
        </div>

        <div style={{ marginTop: '3rem', borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', opacity: 0.5 }}>ExpensePro v2.0 • Institutional Grade Security</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
