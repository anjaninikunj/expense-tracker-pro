import React, { useState, useEffect } from 'react';
import { Save, X, Activity } from 'lucide-react';

const CATEGORY_OPTIONS = ['Investment', 'Expense', 'Bank', 'Home', 'Farm', 'Wife', 'Son', 'Mom', 'Father', 'Rent'];
const DESCRIPTION_OPTIONS = ['Mutual Fund', 'SIP', 'Farm', 'Other'];
const SOURCE_OPTIONS = ['Cash', 'ICICI Bank', 'BOB Bank'];

const TransactionForm = ({ initialData = null, onSubmit, onCancel }) => {
  const isEditing = !!initialData;
  
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: 'Home',
    descriptionDropdown: 'Other',
    customDescription: '',
    source: 'Cash'
  });

  useEffect(() => {
    if (initialData) {
      const isCustomDesc = !DESCRIPTION_OPTIONS.includes(initialData.description);
      setFormData({
        amount: initialData.amount || '',
        type: initialData.type || 'expense',
        category: CATEGORY_OPTIONS.includes(initialData.category) ? initialData.category : 'Home',
        descriptionDropdown: isCustomDesc ? 'Other' : initialData.description,
        customDescription: isCustomDesc ? initialData.description : '',
        source: initialData.source || 'Cash'
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || isNaN(formData.amount)) {
      alert("Please enter a valid amount");
      return;
    }

    const finalDescription = formData.descriptionDropdown === 'Other' 
      ? formData.customDescription 
      : formData.descriptionDropdown;

    const transactionData = {
      amount: parseInt(formData.amount, 10),
      type: formData.type,
      category: formData.category,
      description: finalDescription || formData.category,
      source: formData.source,
      date: initialData ? initialData.date : new Date().toISOString(),
      excludeFromBalance: false
    };

    if (isEditing && initialData.id) {
      transactionData.id = initialData.id;
      transactionData.createdAt = initialData.createdAt;
      transactionData.username = initialData.username;
    }

    onSubmit(transactionData);
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', position: 'relative' }}>
      {onCancel && (
        <button 
          onClick={onCancel}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>
      )}
      
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Activity size={24} color="var(--accent-color)" />
        {isEditing ? 'Edit Transaction' : 'Manual Entry'}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* TYPE TOGGLE */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '0.4rem', borderRadius: '12px' }}>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'expense' })}
            style={{
              flex: 1, padding: '0.6rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
              background: formData.type === 'expense' ? 'var(--error-color)' : 'transparent',
              color: formData.type === 'expense' ? 'white' : 'var(--text-secondary)'
            }}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'income' })}
            style={{
              flex: 1, padding: '0.6rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
              background: formData.type === 'income' ? 'var(--success-color)' : 'transparent',
              color: formData.type === 'income' ? 'white' : 'var(--text-secondary)'
            }}
          >
            Income / Add Cash
          </button>
        </div>

        {/* AMOUNT */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Amount</label>
          <input 
            type="number" 
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0"
            className="input-field"
            style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', padding: '1rem' }}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* CATEGORY */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Category</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              className="input-field"
            >
              {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* SOURCE */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Account / Source</label>
            <select 
              name="source" 
              value={formData.source} 
              onChange={handleChange}
              className="input-field"
            >
              {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* DESCRIPTION DROPDOWN */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Description</label>
          <select 
            name="descriptionDropdown" 
            value={formData.descriptionDropdown} 
            onChange={handleChange}
            className="input-field"
          >
            {DESCRIPTION_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* CUSTOM DESCRIPTION */}
        {formData.descriptionDropdown === 'Other' && (
          <div className="animate-fade-in">
            <textarea 
              name="customDescription"
              value={formData.customDescription}
              onChange={handleChange}
              placeholder="Enter custom description..."
              className="input-field"
              rows={3}
              style={{ resize: 'vertical', width: '100%', fontFamily: 'inherit' }}
            />
          </div>
        )}

        <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}>
          <Save size={20} /> {isEditing ? 'Update Record' : 'Save Record'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
