import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Copy, Edit2, History, Plus, Search, X } from 'lucide-react';
import CredentialForm from './CredentialForm';
import { db } from '../firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import CryptoJS from 'crypto-js';

const VaultDashboard = ({ currentUser }) => {
  const [credentials, setCredentials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState(null);
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [historyModal, setHistoryModal] = useState({ show: false, data: [] });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "credentials"),
      where("owner", "==", currentUser.username.toLowerCase())
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const credList = snapshot.docs.map(d => {
        const rawData = d.data();
        let decryptedPassword = rawData.password;
        try {
          const mpinKey = currentUser.mpin ? String(currentUser.mpin) : "fallback_secret_key";
          const bytes = CryptoJS.AES.decrypt(rawData.password, mpinKey);
          const originalText = bytes.toString(CryptoJS.enc.Utf8);
          if (originalText) {
            decryptedPassword = originalText;
          }
        } catch (e) {
          console.warn("Could not decrypt a password, returning encrypted string");
        }
        return { ...rawData, id: d.id, password: decryptedPassword };
      });
      // Sort by lastUpdated desc
      credList.sort((a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0));
      setCredentials(credList);
    }, (error) => {
      console.error("Firebase Sync Error:", error);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSaveCredential = async (data) => {
    try {
      const isNew = !data.id;
      const owner = currentUser.username.toLowerCase();
      const mpinKey = currentUser.mpin ? String(currentUser.mpin) : "fallback_secret_key";
      
      const encryptedPassword = CryptoJS.AES.encrypt(data.password, mpinKey).toString();
      
      if (isNew) {
        await addDoc(collection(db, "credentials"), {
          ...data,
          password: encryptedPassword,
          owner,
          lastUpdated: new Date().toISOString()
        });
      } else {
        const docRef = doc(db, "credentials", data.id);
        const { id, ...dataToUpdate } = data;
        dataToUpdate.password = encryptedPassword;
        dataToUpdate.lastUpdated = new Date().toISOString();
        
        // Handle Password History
        const oldCred = credentials.find(c => c.id === data.id);
        if (oldCred && oldCred.password !== data.password) {
          // Password changed, add to history
          await addDoc(collection(db, "passwordHistory"), {
            credentialId: data.id,
            oldPassword: CryptoJS.AES.encrypt(oldCred.password, mpinKey).toString(),
            changedAt: new Date().toISOString()
          });

          // Auto-Pruning logic (Keep Top 3)
          const historyQ = query(
            collection(db, "passwordHistory"),
            where("credentialId", "==", data.id)
          );
          const histSnap = await getDocs(historyQ);
          const allHistory = histSnap.docs.map(d => ({ id: d.id, changedAt: d.data().changedAt }));
          
          // Sort oldest first
          allHistory.sort((a, b) => new Date(a.changedAt) - new Date(b.changedAt));
          
          if (allHistory.length > 3) {
            const docsToDelete = allHistory.slice(0, allHistory.length - 3);
            for (let d of docsToDelete) {
              await deleteDoc(doc(db, "passwordHistory", d.id));
            }
          }
        }
        
        await updateDoc(docRef, dataToUpdate);
      }
      setIsFormOpen(false);
      showToast("Credential Saved Successfully!");
    } catch (error) {
      console.error("Firebase Vault Error:", error);
      showToast("Failed to save credential: " + error.message, "error");
    }
  };

  const handleViewHistory = async (credentialId) => {
    try {
      const historyQ = query(
        collection(db, "passwordHistory"),
        where("credentialId", "==", credentialId)
      );
      const histSnap = await getDocs(historyQ);
      const mpinKey = currentUser.mpin ? String(currentUser.mpin) : "fallback_secret_key";
      
      const allHistory = histSnap.docs.map(d => {
        const rawData = d.data();
        let decryptedOldPassword = rawData.oldPassword;
        try {
          const bytes = CryptoJS.AES.decrypt(rawData.oldPassword, mpinKey);
          const originalText = bytes.toString(CryptoJS.enc.Utf8);
          if (originalText) {
            decryptedOldPassword = originalText;
          }
        } catch (e) {}
        return { ...rawData, oldPassword: decryptedOldPassword };
      });
      allHistory.sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt)); // Newest first
      
      if (allHistory.length === 0) {
        showToast("No password history found for this credential.");
      } else {
        setHistoryModal({ show: true, data: allHistory });
      }
    } catch(e) {
      console.error(e);
      showToast("Error fetching history", "error");
    }
  };

  const togglePassword = (id) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast('✓ Copied to clipboard!');
  };

  const filteredData = credentials.filter(item => 
    (item.platform || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.securityChallenge || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #0ea5e9, #10b981)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(14, 165, 233, 0.3)' }}>
            <Shield color="white" size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem' }}>The Vault</h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Secure Credential Management</p>
          </div>
        </div>
        <button 
          onClick={() => { setEditingCredential(null); setIsFormOpen(true); }}
          style={{ 
          background: 'rgba(14, 165, 233, 0.1)', 
          color: '#0ea5e9', 
          border: '1px solid rgba(14, 165, 233, 0.3)',
          padding: '0.5rem 1rem', 
          borderRadius: '1rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontWeight: '600'
        }}>
          <Plus size={16} /> <span className="mobile-only" style={{ display: 'none' }}>Add</span> <span style={{ display: 'inline' }}>Add New</span>
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input 
          type="text" 
          placeholder="Search platforms, emails, or security questions..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
          style={{ paddingLeft: '2.75rem', borderColor: 'rgba(14, 165, 233, 0.3)' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredData.map(item => (
          <div key={item.id} className="glass-card" style={{ padding: '1.25rem', borderColor: 'rgba(14, 165, 233, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#0ea5e9', marginBottom: '0.25rem' }}>{item.platform}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                  <span style={{ cursor: 'pointer' }} onClick={() => copyToClipboard(item.email)}>{item.email}</span>
                  {item.email && item.username && <span>•</span>}
                  <span style={{ cursor: 'pointer' }} onClick={() => copyToClipboard(item.username)}>{item.username}</span>
                  <span>•</span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(14, 165, 233, 0.7)' }}>Updated: {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleViewHistory(item.id)}
                  style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '0.5rem', color: 'var(--text-primary)' }}
                >
                  <History size={16} />
                </button>
                <button 
                  onClick={() => { setEditingCredential(item); setIsFormOpen(true); }}
                  style={{ background: 'rgba(14, 165, 233, 0.1)', padding: '0.5rem', borderRadius: '0.5rem', color: '#0ea5e9' }}
                >
                  <Edit2 size={16} />
                </button>
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: showPassword[item.id] ? '0' : '2px', color: showPassword[item.id] ? '#10b981' : 'var(--text-primary)' }}>
                {showPassword[item.id] ? item.password : '••••••••••••'}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => togglePassword(item.id)} style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
                  {showPassword[item.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button onClick={() => copyToClipboard(item.password)} style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
                  <Copy size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
            {searchTerm ? 'No credentials match your search.' : 'No credentials saved yet. Click "Add New" to start!'}
          </div>
        )}
      </div>

      {isFormOpen && (
        <CredentialForm 
          initialData={editingCredential}
          onSubmit={handleSaveCredential}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {/* History Modal */}
      {historyModal.show && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(4px)' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '350px', background: 'var(--surface-color)', animation: 'toastSlideUp 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#0ea5e9' }}>Password History</h3>
              <button onClick={() => setHistoryModal({ show: false, data: [] })} style={{ background: 'transparent', color: 'var(--text-secondary)' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {historyModal.data.map((h, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                  <div style={{ fontFamily: 'monospace', color: '#10b981', marginBottom: '0.25rem', letterSpacing: '1px' }}>{h.oldPassword}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Changed: {new Date(h.changedAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modern Toast Notification */}
      {toast.show && (
        <div style={{ 
          position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', 
          background: toast.type === 'error' ? '#ef4444' : '#10b981', 
          color: 'white', padding: '0.75rem 1.5rem', borderRadius: '2rem', 
          boxShadow: '0 10px 20px rgba(0,0,0,0.3)', zIndex: 5000, 
          animation: 'toastSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default VaultDashboard;
