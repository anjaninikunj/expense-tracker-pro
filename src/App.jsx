import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import VoiceRecorder from './components/VoiceRecorder';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import Auth from './components/Auth';
import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  query, 
  where,
  addDoc,
  orderBy
} from 'firebase/firestore';
import { Search, Bell, User, LogOut, Download, Cloud, CloudOff } from 'lucide-react';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('expenses_pro_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  // 1. Sync Users from Cloud (Real-time)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
      setIsCloudSynced(true);
    }, (error) => {
      console.error("Users Sync Error:", error);
      setIsCloudSynced(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Sync Transactions from Cloud (Filtered by Current User)
  useEffect(() => {
    if (!currentUser) return;

    // We removed orderBy to prevent "Index Required" errors for now
    const q = query(
      collection(db, "transactions"), 
      where("username", "==", currentUser.username.toLowerCase())
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort manually by date desc
      const sortedTrans = transList.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(sortedTrans);
    }, (error) => {
      console.error("Transaction Sync Error:", error);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Handle User Persistence
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('expenses_pro_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('expenses_pro_user');
    }
  }, [currentUser]);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
  };

  const handleRegister = async (newUser) => {
    try {
      // Save to Cloud
      await setDoc(doc(db, "users", newUser.username.toLowerCase()), {
        username: newUser.username,
        mpin: newUser.mpin,
        createdAt: newUser.createdAt
      });
      setCurrentUser(newUser);
    } catch (error) {
      alert("Registration failed: " + error.message);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleNewTransaction = async (data) => {
    try {
      await addDoc(collection(db, "transactions"), { 
        ...data, 
        username: currentUser.username.toLowerCase(),
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      alert("Failed to save transaction: " + error.message);
    }
  };

  const exportToJson = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `expenses_cloud_backup_${currentUser.username}_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} onRegister={handleRegister} users={users} />;
  }

  const filteredTransactions = activeCategory === 'all' 
    ? transactions 
    : transactions.filter(t => t.category === activeCategory);

  return (
    <div className="app-container">
      <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      
      <main className="main-content">
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem' 
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
                Hello, {currentUser.username} 👋
              </h1>
              {isCloudSynced ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', padding: '0.2rem 0.5rem', borderRadius: '2rem', fontSize: '0.65rem', fontWeight: 'bold' }}>
                  <Cloud size={10} /> CLOUD SYNCED
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', padding: '0.2rem 0.5rem', borderRadius: '2rem', fontSize: '0.65rem', fontWeight: 'bold' }}>
                  <CloudOff size={10} /> OFFLINE
                </div>
              )}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Your global cloud wallet is connected and secure.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="glass-card" style={{ padding: '0.5rem', borderRadius: '0.75rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button 
                onClick={exportToJson}
                style={{ background: 'transparent', padding: '0.4rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}
                title="Export cloud data to JSON"
              >
                <Download size={18} />
                <span>Cloud Backup</span>
              </button>
              
              <div style={{ borderLeft: '1px solid var(--card-border)', height: '20px' }}></div>
              
              <div style={{ padding: '0.4rem', borderRadius: '0.5rem', cursor: 'pointer' }}><Search size={20} color="var(--text-secondary)" /></div>
              <div style={{ padding: '0.4rem', borderRadius: '0.5rem', cursor: 'pointer' }}><Bell size={20} color="var(--text-secondary)" /></div>
              
              <div style={{ borderLeft: '1px solid var(--card-border)', height: '20px' }}></div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0 0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(45deg, #7c3aed, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} color="white" />
                </div>
                <button 
                  onClick={handleLogout}
                  style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', padding: '0.4rem', borderRadius: '0.5rem' }}
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <VoiceRecorder onCommandProcessed={handleNewTransaction} />

        <Dashboard transactions={filteredTransactions} />
        
        <TransactionList transactions={filteredTransactions} />

        <div style={{ marginTop: '3rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
          <p>Expense Manager Pro v1.1 • Secure User Environment • {new Date().getFullYear()} Financial Tracking</p>
        </div>
      </main>
    </div>
  );
}

export default App;
