import React from 'react';
import { Calendar, Wallet, Landmark, Banknote, ShoppingBag, ArrowUpRight, ArrowDownLeft, Trash2, Pencil } from 'lucide-react';
import { format } from 'date-fns';

const TransactionList = ({ transactions, onDeleteTransaction, onEditTransaction }) => {
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateDiff = new Date(b.date) - new Date(a.date);
    if (dateDiff !== 0) return dateDiff;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  const totalBalance = transactions.reduce((sum, t) => {
    const type = t.type?.toLowerCase();
    if (t.excludeFromBalance) return sum;
    if (type === 'income') return sum + t.amount;
    if (type === 'expense') return sum - t.amount;
    return sum;
  }, 0);

  const sortedAll = [...transactions].sort((a, b) => {
    const dateDiff = new Date(b.date) - new Date(a.date);
    if (dateDiff !== 0) return dateDiff;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  const allProcessed = [];
  let rolling = totalBalance;
  for (let i = 0; i < sortedAll.length; i++) {
    const t = sortedAll[i];
    allProcessed[i] = { ...t, runningBalance: rolling };
    const type = t.type?.toLowerCase();
    if (!t.excludeFromBalance) {
      if (type === 'income') rolling -= t.amount;
      else if (type === 'expense') rolling += t.amount;
    }
  }
  const processedTransactions = allProcessed;

  const getIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'wife':
      case 'mom': return <ShoppingBag size={20} />;
      case 'farm': return <Landmark size={20} />;
      case 'rent': return <Landmark size={20} />;
      default: return <Wallet size={20} />;
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>Activity History</h3>
        <span className="text-xs-bold" style={{ opacity: 0.5 }}>{transactions.length} Total</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {processedTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No transaction records found.
          </div>
        ) : (
          processedTransactions.map(t => (
            <div key={t.id} className="transaction-item">
              <div className="transaction-icon" style={{ 
                background: t.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.04)',
                color: t.type === 'income' ? 'var(--success-color)' : 'var(--text-primary)'
              }}>
                {getIcon(t.category)}
              </div>
              <div className="transaction-details">
                <div className="transaction-name">{t.description || t.category}</div>
                <div className="transaction-meta">
                  {format(new Date(t.date), 'dd MMM yyyy')} • {t.source}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div className={`transaction-amount ${t.type === 'income' ? 'amount-income' : 'amount-expense'}`}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                    Bal: ₹{t.runningBalance.toLocaleString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => onEditTransaction && onEditTransaction(t)}
                    style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '0.5rem', borderRadius: '10px', border: 'none', cursor: 'pointer' }}
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this record?")) {
                        onDeleteTransaction(t.id);
                      }
                    }}
                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', padding: '0.5rem', borderRadius: '10px', border: 'none', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
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
