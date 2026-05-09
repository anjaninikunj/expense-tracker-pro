import React from 'react';
import { Home, LayoutDashboard, History, Mic, PlusSquare, User, LogOut, Briefcase, Heart, Users, Database, Tractor, Key, X } from 'lucide-react';

const Sidebar = ({ activeCategory, setActiveCategory, activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'all', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'Wife', name: 'Wife', icon: <Heart size={20} /> },
    { id: 'Son', name: 'Son', icon: <Users size={20} /> },
    { id: 'Father', name: 'Father', icon: <Database size={20} /> },
    { id: 'Mom', name: 'Mom', icon: <Heart size={20} /> },
    { id: 'Farm', name: 'Farm', icon: <Tractor size={20} /> },
    { id: 'Rent', name: 'Rent', icon: <Key size={20} /> },
    { id: 'Investment', name: 'Investment', icon: <Briefcase size={20} /> },
    { id: 'Home', name: 'Home', icon: <Home size={20} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'block'
          }}
          className="mobile-only"
        />
      )}

      <div className={`desktop-sidebar ${isOpen ? 'open' : ''}`} style={{ 
        width: '280px', 
        background: 'var(--surface-color)', 
        borderRight: '1px solid var(--card-border)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1100,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--accent-gradient)', width: '42px', height: '42px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px var(--accent-glow)' }}>
              <Briefcase color="white" size={24} />
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '-0.05em' }}>ExpensePro</h1>
          </div>
          <button onClick={() => setIsOpen(false)} className="mobile-only" style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
            <X size={24} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
          
          <div style={{ padding: '0.5rem 1rem', fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.05em', marginTop: '0.5rem' }}>ACTIONS</div>
          
          <button
            onClick={() => { setActiveTab('manual'); setIsOpen(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1rem', borderRadius: '1rem',
              background: activeTab === 'manual' ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
              color: activeTab === 'manual' ? 'var(--accent-color)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'manual' ? '700' : '500', transition: '0.3s', textAlign: 'left'
            }}
          >
            <span style={{ opacity: activeTab === 'manual' ? 1 : 0.7 }}><PlusSquare size={20} /></span>
            <span style={{ fontSize: '0.95rem' }}>Manual Entry</span>
          </button>

          <button
            onClick={() => { setActiveTab('voice'); setIsOpen(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1rem', borderRadius: '1rem',
              background: activeTab === 'voice' ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
              color: activeTab === 'voice' ? 'var(--accent-color)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'voice' ? '700' : '500', transition: '0.3s', textAlign: 'left'
            }}
          >
            <span style={{ opacity: activeTab === 'voice' ? 1 : 0.7 }}><Mic size={20} /></span>
            <span style={{ fontSize: '0.95rem' }}>Voice Assistant</span>
          </button>

          <button
            onClick={() => { setActiveTab('transactions'); setIsOpen(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1rem', borderRadius: '1rem',
              background: activeTab === 'transactions' ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
              color: activeTab === 'transactions' ? 'var(--accent-color)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'transactions' ? '700' : '500', transition: '0.3s', textAlign: 'left'
            }}
          >
            <span style={{ opacity: activeTab === 'transactions' ? 1 : 0.7 }}><History size={20} /></span>
            <span style={{ fontSize: '0.95rem' }}>Full History</span>
          </button>

          <div style={{ padding: '0.5rem 1rem', fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.05em', marginTop: '1rem' }}>CATEGORIES</div>

          {menuItems.map(item => {
            const isCategoryActive = activeTab === 'dashboard' && activeCategory === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveCategory(item.id);
                  setActiveTab('dashboard');
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1rem', borderRadius: '1rem',
                  background: isCategoryActive ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                  color: isCategoryActive ? 'var(--accent-color)' : 'var(--text-secondary)',
                  fontWeight: isCategoryActive ? '700' : '500', transition: '0.3s', textAlign: 'left'
                }}
              >
                <span style={{ opacity: isCategoryActive ? 1 : 0.7 }}>{item.icon}</span>
                <span style={{ fontSize: '0.95rem' }}>{item.name}</span>
              </button>
            )
          })}
        </nav>

        <div style={{ marginTop: 'auto', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1.5rem', border: '1px solid var(--card-border)' }}>
          <p className="text-xs-bold" style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>FINANCIAL YEAR</p>
          <p style={{ fontSize: '0.9rem', fontWeight: '700' }}>Apr 2026 - Apr 2027</p>
          <div style={{ width: '40px', height: '3px', background: 'var(--accent-color)', borderRadius: '10px', marginTop: '0.75rem' }}></div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
