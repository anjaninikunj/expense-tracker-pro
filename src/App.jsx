import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import VoiceRecorder from './components/VoiceRecorder';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import VaultDashboard from './components/VaultDashboard';
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
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { Search, Bell, User, LogOut, LayoutDashboard, History, Mic, CreditCard, Cloud, CloudOff, PlusSquare } from 'lucide-react';
import TransactionForm from './components/TransactionForm';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('expenses_pro_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // 1. Sync Users from Cloud (Real-time)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersList = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
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

    const q = query(
      collection(db, "transactions"), 
      where("username", "==", currentUser.username.toLowerCase())
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transList = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
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

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (editingTransaction) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [editingTransaction]);

  const handleLogin = (userData) => setCurrentUser(userData);
  const handleRegister = async (newUser) => {
    try {
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
    if (currentUser) {
      localStorage.setItem('expenses_pro_last_user', currentUser.username);
    }
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

  const handleDeleteTransaction = async (id) => {
    if (!id) return;
    
    try {
      const transactionsCol = collection(db, "transactions");
      const docRef = doc(transactionsCol, id);
      
      await deleteDoc(docRef);
      alert("Record Deleted Successfully!"); 
    } catch (error) {
      console.error("Firebase Deletion Error:", error);
      alert("Failed to delete transaction: " + error.message);
    }
  };

  const handleEditTransaction = async (updatedData) => {
    if (!updatedData.id) return;
    try {
      const docRef = doc(db, "transactions", updatedData.id);
      // Ensure we remove the id before updating firestore to avoid nesting it inside doc
      const { id, ...dataToUpdate } = updatedData;
      await updateDoc(docRef, dataToUpdate);
      setEditingTransaction(null);
      alert("Record Updated Successfully!");
    } catch (error) {
      console.error("Firebase Update Error:", error);
      alert("Failed to update transaction: " + error.message);
    }
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} onRegister={handleRegister} users={users} />;
  }

  // Filter transactions based on category
  const filteredTransactions = activeCategory === 'all' 
    ? transactions 
    : transactions.filter(t => t.category === activeCategory);

  return (
    <div className="app-container">
      <Sidebar 
        activeCategory={activeCategory} 
        setActiveCategory={(cat) => {
          setActiveCategory(cat);
          if (activeTab !== 'dashboard') setActiveTab('dashboard');
        }} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <main className="main-content">
        {/* ... header ... */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="mobile-only"
              style={{ background: 'transparent', color: 'var(--text-primary)' }}
            >
              <div style={{ width: '32px', height: '32px', display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'center' }}>
                <div style={{ height: '3px', background: 'white', borderRadius: '4px' }}></div>
                <div style={{ height: '3px', background: 'white', borderRadius: '4px', width: '20px' }}></div>
                <div style={{ height: '3px', background: 'white', borderRadius: '4px' }}></div>
              </div>
            </button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                {isCloudSynced ? (
                  <div style={{ background: 'var(--success-glow)', color: 'var(--success-color)', padding: '0.2rem 0.5rem', borderRadius: '2rem', fontSize: '10px', fontWeight: '900' }}>
                    <Cloud size={10} style={{ marginRight: '4px' }} /> ONLINE
                  </div>
                ) : (
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', padding: '0.2rem 0.5rem', borderRadius: '2rem', fontSize: '10px', fontWeight: '900' }}>
                     <CloudOff size={10} style={{ marginRight: '4px' }} /> OFFLINE
                  </div>
                )}
              </div>
              <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{activeCategory === 'all' ? `Hello, ${currentUser.username}` : activeCategory}</h1>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '14px', border: '2px solid var(--accent-color)', padding: '2px' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '10px', background: 'linear-gradient(45deg, #7c3aed, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} color="white" />
              </div>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <>
            <Dashboard transactions={filteredTransactions} />
            {activeCategory === 'all' && (
              <>
                <h2 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Premium Analysis</h2>
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Daily Spending Insight</p>
                  <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)', margin: '1rem 0' }}></div>
                  <p style={{ fontSize: '0.9rem', fontWeight: '500', color: '#cbd5e1' }}>You've saved 12% more than last month. Keep it up! 🚀</p>
                </div>
              </>
            )}
            
            <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>
              {activeCategory === 'all' ? 'Recent Activity' : `${activeCategory} Transactions`}
            </h2>
            <TransactionList 
              transactions={filteredTransactions} 
              onDeleteTransaction={handleDeleteTransaction}
              onEditTransaction={setEditingTransaction}
            />
          </>
        )}

        {activeTab === 'voice' && (
           <VoiceRecorder 
             onCommandProcessed={handleNewTransaction} 
             onDeleteTransaction={handleDeleteTransaction}
             onEditTransaction={setEditingTransaction}
             transactions={filteredTransactions} 
           />
        )}

        {activeTab === 'transactions' && (
          <TransactionList 
            transactions={filteredTransactions} 
            onDeleteTransaction={handleDeleteTransaction}
            onEditTransaction={setEditingTransaction}
          />
        )}

        {activeTab === 'manual' && (
          <TransactionForm 
            onSubmit={(data) => {
              handleNewTransaction(data);
              alert('Record Added Successfully!');
              setActiveTab('dashboard');
            }} 
          />
        )}

        {activeTab === 'vault' && (
          <VaultDashboard currentUser={currentUser} />
        )}

        {/* Edit Modal Wrapper */}
        {editingTransaction && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(8, 10, 15, 0.95)', zIndex: 2000,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            padding: '2rem 1rem', overflowY: 'auto'
          }}>
            <div style={{ width: '100%', maxWidth: '500px', margin: 'auto', paddingBottom: '10rem' }}>
              <TransactionForm 
                initialData={editingTransaction}
                onSubmit={handleEditTransaction}
                onCancel={() => setEditingTransaction(null)}
              />
            </div>
          </div>
        )}

        {/* Floating Logout for Mobile App Feel */}
        <button 
          onClick={handleLogout}
          style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 100, background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', padding: '0.5rem', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.2)' }}
        >
          <LogOut size={16} />
        </button>

        <div className="bottom-nav">
          <button onClick={() => setActiveTab('dashboard')} className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={24} />
            <span>Home</span>
          </button>
          <button onClick={() => setActiveTab('transactions')} className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}>
            <History size={24} />
            <span>History</span>
          </button>
          <div className="voice-mic-container" style={{ margin: '-30px 0 0 0' }}>
            <button onClick={() => setActiveTab('voice')} className={`mic-button ${activeTab === 'voice' ? 'animate-pulse-glamour' : ''}`}>
               <Mic size={32} />
            </button>
            <span style={{ fontSize: '0.6rem', fontWeight: 'bold', color: activeTab === 'voice' ? 'var(--accent-color)' : 'var(--text-secondary)', marginTop: '4px' }}>VOICE</span>
          </div>
          <button onClick={() => setActiveTab('manual')} className={`nav-item ${activeTab === 'manual' ? 'active' : ''}`}>
            <PlusSquare size={24} />
            <span>Manual</span>
          </button>
          <button onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(true); }} className={`nav-item`}>
            <User size={24} />
            <span>Menu</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
