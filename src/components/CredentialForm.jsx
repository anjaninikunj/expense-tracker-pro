import React, { useState, useEffect } from 'react';
import { X, Save, ShieldCheck, Wand2 } from 'lucide-react';

const CredentialForm = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    platform: '',
    email: '',
    username: '',
    password: '',
    securityChallenge: '',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let newPassword = "";
    for (let i = 0; i < 16; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Ensure at least one number, one uppercase, one special char
    setFormData(prev => ({ ...prev, password: newPassword }));
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'transparent' };
    let score = 0;
    if (pass.length > 6) score++;
    if (pass.length > 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score: 33, label: 'Weak', color: '#ef4444' };
    if (score <= 4) return { score: 66, label: 'Good', color: '#f59e0b' };
    return { score: 100, label: 'Strong', color: '#10b981' };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 3000,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div 
        className="glass-card slide-over"
        style={{
          width: '100%',
          maxWidth: '400px',
          height: '100vh',
          borderRadius: '2rem 0 0 2rem',
          borderRight: 'none',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(14, 165, 233, 0.1)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck color="#0ea5e9" size={20} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{initialData ? 'Edit Credential' : 'New Credential'}</h2>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '50%', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Platform Name</label>
            <input 
              type="text" 
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              placeholder="e.g. Google, Bank of America"
              className="input-field" 
              required
              style={{ borderColor: 'rgba(14, 165, 233, 0.3)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Email ID</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. gemini@gmail.com"
              className="input-field" 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Username</label>
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. gemini501"
              className="input-field" 
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
               <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Password</label>
               <button 
                  type="button"
                  onClick={generatePassword}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#0ea5e9', background: 'rgba(14, 165, 233, 0.1)', padding: '4px 8px', borderRadius: '8px', fontWeight: 'bold' }}
               >
                 <Wand2 size={12} /> Generate
               </button>
            </div>
            <input 
              type="text" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="input-field" 
              required
            />
            {formData.password && (
               <div style={{ marginTop: '0.5rem' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>Strength</span>
                    <span style={{ color: strength.color, fontWeight: 'bold' }}>{strength.label}</span>
                 </div>
                 <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${strength.score}%`, background: strength.color, transition: 'all 0.3s' }}></div>
                 </div>
               </div>
            )}
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0.5rem 0' }}></div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Security Challenge (Q&A)</label>
            <input 
              type="text" 
              name="securityChallenge"
              value={formData.securityChallenge}
              onChange={handleChange}
              placeholder="e.g. Mother's Maiden Name? - Antigravity_99"
              className="input-field" 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Notes (Profile / Use Case)</label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. Personal Account, Change every 90 days"
              className="input-field"
              rows="3"
            />
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '2rem', paddingBottom: '3rem' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #0ea5e9, #10b981)', border: 'none', color: 'white' }}>
              <Save size={20} />
              {initialData ? 'Update Credential' : 'Save Credential'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CredentialForm;
