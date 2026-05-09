import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Check, X, Sparkles, Activity, ShoppingBag, Landmark, Wallet, Trash2, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { parseVoiceCommand } from '../utils/parser';

const VoiceRecorder = ({ onCommandProcessed, onDeleteTransaction, onEditTransaction, transactions = [] }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [lang, setLang] = useState('en-IN'); // Default to English (India)

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = lang; 
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript;
      setTranscript(text);
      const data = parseVoiceCommand(text);
      setParsedData(data);
    };

    recognition.start();
  };

  const confirmCommand = () => {
    onCommandProcessed(parsedData);
    setParsedData(null);
    setTranscript('');
  };

  let currentRollingBalance = transactions.reduce((sum, t) => {
    const type = t.type?.toLowerCase();
    if (t.excludeFromBalance) return sum;
    if (type === 'income') return sum + t.amount;
    if (type === 'expense') return sum - t.amount;
    return sum;
  }, 0);

  const processedRecent = [...transactions]
    .sort((a, b) => {
      const dateDiff = new Date(b.date) - new Date(a.date);
      if (dateDiff !== 0) return dateDiff;
      return new Date(b.createdAt || 0) - new Date(b.createdAt || 0);
    })
    .map(t => {
      const record = { ...t, runningBalance: currentRollingBalance };
      const type = t.type?.toLowerCase();
      if (!t.excludeFromBalance) {
        if (type === 'income') currentRollingBalance -= t.amount;
        else if (type === 'expense') currentRollingBalance += t.amount;
      }
      return record;
    })
    .slice(0, 3);

  const getIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'wife':
      case 'mom': return <ShoppingBag size={18} />;
      case 'farm':
      case 'rent': return <Landmark size={18} />;
      default: return <Wallet size={18} />;
    }
  };

  return (
    <div className="voice-entry-container" style={{ padding: '0 0 1rem 0' }}>
      <div className="glass-card" style={{ textAlign: 'center', padding: '2rem 1.5rem', position: 'relative', marginBottom: '2rem' }}>
         <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              className="text-xs-bold"
              style={{ 
                background: 'rgba(255,255,255,0.05)', 
                color: 'var(--text-secondary)', 
                border: 'none', 
                padding: '0.4rem 0.8rem',
                borderRadius: '10px'
              }}
            >
              <option value="en-IN">EN</option>
              <option value="gu-IN">GU</option>
            </select>
         </div>

         <div className="voice-mic-container" style={{ margin: '0 auto' }}>
            <button 
              onClick={startListening}
              className={`mic-button ${isListening ? 'recording' : ''}`}
            >
              {isListening ? <Activity size={32} className="animate-pulse" /> : <Mic size={32} />}
            </button>
         </div>

         <h2 style={{ marginTop: '1.25rem', marginBottom: '0.4rem', fontSize: '1.25rem' }}>{isListening ? 'I\'m Listening...' : 'Speak to AI Assistant'}</h2>
         <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>"I am going to buy ice cream for 500"</p>

         {transcript && (
           <div className="animate-fade-in" style={{ marginTop: '1.5rem' }}>
              <div className="glass-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', border: '1px dashed var(--card-border)' }}>
                <p style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>"{transcript}"</p>
                
                {parsedData && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem', textAlign: 'left' }}>
                    <DataPoint label="AMOUNT" value={`₹${parsedData.amount}`} color="var(--success-color)" />
                    <DataPoint label="TYPE" value={parsedData.type.toUpperCase()} />
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={confirmCommand} className="btn-primary" style={{ flex: 1, justifyContent: 'center', height: '48px', padding: 0 }}>
                    <Check size={20} />
                  </button>
                  <button onClick={() => { setTranscript(''); setParsedData(null); }} style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                    <X size={20} />
                  </button>
                </div>
              </div>
           </div>
         )}
      </div>

      {/* Recent Records - Mirroring History View */}
      {!transcript && processedRecent.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 0.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>RECENT ACTIVITY</h3>
            <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontWeight: '800' }}>LAST 3</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {processedRecent.map(t => (
              <div key={t.id} className="transaction-item" style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '1.5rem', border: '1px solid var(--card-border)' }}>
                <div className="transaction-icon" style={{ 
                  background: t.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.04)',
                  color: t.type === 'income' ? 'var(--success-color)' : 'var(--text-primary)',
                  width: '40px', height: '40px'
                }}>
                  {getIcon(t.category)}
                </div>
                <div className="transaction-details">
                  <div className="transaction-name" style={{ fontSize: '0.85rem' }}>{t.description || t.category}</div>
                  <div className="transaction-meta" style={{ fontSize: '0.7rem' }}>
                    {format(new Date(t.date), 'dd MMM')} • {t.source}
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div>
                    <div className={`transaction-amount ${t.type === 'income' ? 'amount-income' : 'amount-expense'}`} style={{ fontSize: '0.9rem' }}>
                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: '700' }}>
                      Bal: ₹{t.runningBalance.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button 
                      onClick={() => onEditTransaction && onEditTransaction(t)}
                      style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '0.4rem', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm("Delete this record?")) {
                          onDeleteTransaction(t.id);
                        }
                      }}
                      style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', padding: '0.4rem', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DataPoint = ({ label, value, color }) => (
  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '1rem', border: '1px solid var(--card-border)' }}>
    <p className="text-xs-bold" style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{label}</p>
    <p style={{ fontWeight: '700', fontSize: '0.9rem', color: color || 'white' }}>{value}</p>
  </div>
);

export default VoiceRecorder;
