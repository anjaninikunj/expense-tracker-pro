import React from 'react';
import { Home, Users, Tractor, Heart, Briefcase, LayoutDashboard, Database, Key } from 'lucide-react';

const Sidebar = ({ activeCategory, setActiveCategory }) => {
  const categories = [
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
    <div style={{ 
      width: '280px', 
      background: 'rgba(13, 15, 20, 0.8)', 
      borderRight: '1px solid var(--card-border)',
      padding: '2rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      position: 'sticky',
      top: 0,
      height: '100vh'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem' }}>
        <div style={{ background: 'var(--accent-color)', width: '40px', height: '40px', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Briefcase color="white" size={24} />
        </div>
        <h1 style={{ fontSize: '1.25rem' }}>ExpensePro</h1>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              background: activeCategory === cat.id ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
              color: activeCategory === cat.id ? 'var(--accent-color)' : 'var(--text-secondary)',
              fontWeight: activeCategory === cat.id ? '600' : '400',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => { if(activeCategory !== cat.id) e.currentTarget.style.color = 'white' }}
            onMouseLeave={(e) => { if(activeCategory !== cat.id) e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>FINANCIAL YEAR</p>
        <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>Apr 2026 - Apr 2027</p>
      </div>
    </div>
  );
};

export default Sidebar;
