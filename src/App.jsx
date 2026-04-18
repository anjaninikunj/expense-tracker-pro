import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import VoiceRecorder from './components/VoiceRecorder';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import Auth from './components/Auth';
import { Search, Bell, User, LogOut, Download } from 'lucide-react';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('expenses_pro_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('expenses_pro_data');
    if (saved) return JSON.parse(saved);
    
    // Initial mock data
    return [
      { id: 1, amount: 100000, type: 'income', category: 'Home', subCategory: 'General', description: 'Opening Balance (Cash)', source: 'Personal', date: '2026-04-01T10:00:00Z', username: 'Nikunj' },
      { id: 2, amount: 5000, type: 'withdrawal', category: 'Home', subCategory: 'Cash', description: 'Rs. 5000 withdraw from Xbob', source: 'BOB Bank', date: '2026-04-05T09:00:00Z', username: 'Nikunj' },
      { id: 3, amount: 6500, type: 'expense', category: 'Investment', subCategory: 'Mutual Fund', description: 'Rs. 6500 Db ICICI multiple asset', source: 'ICICI Bank', date: '2026-04-06T11:00:00Z', username: 'Nikunj' },
      { id: 4, amount: 50000, type: 'transfer', category: 'Home', subCategory: 'Transfer', description: 'Rs. 50000 translate xbob to icicibank', source: 'BOB Bank', destination: 'ICICI Bank', date: '2026-04-08T14:00:00Z', username: 'Nikunj' },
    ];
  });
  
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    localStorage.setItem('expenses_pro_data', JSON.stringify(transactions));
  }, [transactions]);

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

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleNewTransaction = (data) => {
    setTransactions(prev => [...prev, { 
      ...data, 
      id: Date.now(),
      username: currentUser.username 
    }]);
  };

  const exportToJson = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `expenses_backup_${currentUser.username}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  const userTransactions = transactions.filter(t => t.username === currentUser.username);

  const filteredTransactions = activeCategory === 'all' 
    ? userTransactions 
    : userTransactions.filter(t => t.category === activeCategory);

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
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
              Hello, {currentUser.username} 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Here's what's happening with your expenses today.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="glass-card" style={{ padding: '0.5rem', borderRadius: '0.75rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button 
                onClick={exportToJson}
                style={{ background: 'transparent', padding: '0.4rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}
                title="Export data to JSON"
              >
                <Download size={18} />
                <span>Backup JSON</span>
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
