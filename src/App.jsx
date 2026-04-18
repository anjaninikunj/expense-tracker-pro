import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import VoiceRecorder from './components/VoiceRecorder';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import { Search, Bell, User } from 'lucide-react';

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('expenses_pro_data');
    if (saved) return JSON.parse(saved);
    
    // Initial mock data from user prompt
    return [
      { id: 1, amount: 100000, type: 'income', category: 'Home', subCategory: 'General', description: 'Opening Balance (Cash)', source: 'Personal', date: '2026-04-01T10:00:00Z' },
      { id: 2, amount: 5000, type: 'withdrawal', category: 'Home', subCategory: 'Cash', description: 'Rs. 5000 withdraw from Xbob', source: 'BOB Bank', date: '2026-04-05T09:00:00Z' },
      { id: 3, amount: 6500, type: 'expense', category: 'Investment', subCategory: 'Mutual Fund', description: 'Rs. 6500 Db ICICI multiple asset', source: 'ICICI Bank', date: '2026-04-06T11:00:00Z' },
      { id: 4, amount: 50000, type: 'transfer', category: 'Home', subCategory: 'Transfer', description: 'Rs. 50000 translate xbob to icicibank', source: 'BOB Bank', destination: 'ICICI Bank', date: '2026-04-08T14:00:00Z' },
      { id: 5, amount: 3500, type: 'expense', category: 'Son', subCategory: 'Education', description: 'Rs. 3500 given children tution fee(priyansh)', source: 'Cash', date: '2026-04-10T16:00:00Z' },
      { id: 6, amount: 21000, type: 'expense', category: 'Wife', subCategory: 'Clothes', description: 'Rs. 21000 for blouse of my wife', source: 'Cash', date: '2026-04-12T10:00:00Z' },
      { id: 7, amount: 35000, type: 'expense', category: 'Father', subCategory: 'Labour', description: 'Rs. 35000 give father for padded crops harvesting labour cost', source: 'Cash', date: '2026-04-15T12:00:00Z' },
    ];
  });
  
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    localStorage.setItem('expenses_pro_data', JSON.stringify(transactions));
  }, [transactions]);

  const handleNewTransaction = (data) => {
    setTransactions(prev => [...prev, { ...data, id: Date.now() }]);
  };

  const filteredTransactions = activeCategory === 'all' 
    ? transactions 
    : transactions.filter(t => t.category === activeCategory);

  return (
    <div className="app-container">
      <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      
      <main className="main-content">
        {/* Header */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem' 
        }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
              Hello, Nikunj 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Here's what's happening with your expenses today.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="glass-card" style={{ padding: '0.5rem', borderRadius: '0.75rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ padding: '0.4rem', borderRadius: '0.5rem', cursor: 'pointer' }}><Search size={20} color="var(--text-secondary)" /></div>
              <div style={{ padding: '0.4rem', borderRadius: '0.5rem', cursor: 'pointer' }}><Bell size={20} color="var(--text-secondary)" /></div>
              <div style={{ borderLeft: '1px solid var(--card-border)', height: '20px' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(45deg, #7c3aed, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} color="white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <VoiceRecorder onCommandProcessed={handleNewTransaction} />

        <Dashboard transactions={filteredTransactions} />
        
        <TransactionList transactions={filteredTransactions} />

        {/* Footer info about specific request */}
        <div style={{ marginTop: '3rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
          <p>Expense Manager Pro v1.0 • Built for April 2026 - April 2027 Financial Year</p>
        </div>
      </main>
    </div>
  );
}

export default App;
