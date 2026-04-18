import React from 'react';
import { Calendar, ArrowUpRight, ArrowDownLeft, Shuffle, Clock } from 'lucide-react';
import { format } from 'date-fns';

const TransactionList = ({ transactions }) => {
  // Calculate running balances
  const processedTransactions = [...transactions]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .reduce((acc, t, index) => {
      const prevBal = index === 0 ? 0 : acc[index - 1].runningBalance;
      let impact = t.amount;
      if (t.type === 'expense' || t.type === 'withdrawal') impact = -t.amount;
      if (t.excludeFromBalance) impact = 0;
      
      acc.push({
        ...t,
        runningBalance: prevBal + impact
      });
      return acc;
    }, []);

  const reversedTransactions = processedTransactions.reverse();

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>Activity History</h3>
        <select style={{ 
          background: 'rgba(255,255,255,0.05)', 
          color: 'white', 
          border: '1px solid var(--card-border)', 
          padding: '0.4rem 0.8rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem'
        }}>
          <option>April 2026 - April 2027</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reversedTransactions.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No transactions recorded.</p>
        ) : (
          reversedTransactions.map(t => (
            <div key={t.id} style={{ 
              display: 'flex', 
              flexDirection: 'column',
              background: 'rgba(255,255,255,0.02)', 
              borderRadius: '1.25rem',
              border: '1px solid var(--card-border)',
              overflow: 'hidden'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                padding: '1rem'
              }}>
                <div style={{ 
                  background: t.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : t.type === 'transfer' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  padding: '0.75rem',
                  borderRadius: '0.75rem'
                }}>
                  {t.type === 'income' ? <ArrowUpRight color="#10b981" size={20} /> : t.type === 'transfer' ? <Shuffle color="#7c3aed" size={20} /> : <ArrowDownLeft color="#ef4444" size={20} />}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: '600', fontSize: '1rem' }}>{t.description}</span>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: '700', fontSize: '1.1rem', color: t.type === 'income' ? '#10b981' : '#ef4444', display: 'block' }}>
                        {t.type === 'income' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                        Bal: ₹{t.runningBalance.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12} /> {format(new Date(t.date), 'dd MMM yyyy')}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> {format(new Date(t.date), 'hh:mm a')}</span>
                    <span>{t.category} • {t.subCategory}</span>
                    <span>via {t.source}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;
