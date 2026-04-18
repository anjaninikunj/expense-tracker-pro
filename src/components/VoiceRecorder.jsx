import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Check, X } from 'lucide-react';
import { parseVoiceCommand } from '../utils/parser';

const VoiceRecorder = ({ onCommandProcessed }) => {
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

  return (
    <div className="glass-card" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Voice Assistant</h2>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {isListening ? "Listening..." : "Tap to speak in"}
            </p>
            {!isListening && (
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                style={{ 
                  background: 'transparent', 
                  color: 'var(--accent-color)', 
                  border: 'none', 
                  fontSize: '0.875rem', 
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <option value="en-IN">English</option>
                <option value="gu-IN">ગુજરાતી (Gujarati)</option>
              </select>
            )}
          </div>
        </div>
        <button 
          onClick={startListening}
          className={`btn-primary ${isListening ? 'animate-pulse-slow' : ''}`}
          style={{ 
            width: '3.5rem', 
            height: '3.5rem', 
            borderRadius: '50%', 
            padding: 0, 
            justifyContent: 'center',
            background: isListening ? 'var(--error-color)' : 'var(--accent-color)'
          }}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
      </div>

      {transcript && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem' }}>
          <p style={{ fontSize: '1rem', fontStyle: 'italic', marginBottom: '1rem' }}>"{transcript}"</p>
          
          {parsedData && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              <Tag label="Amount" value={`₹${parsedData.amount}`} />
              <Tag label="Type" value={parsedData.type} />
              <Tag label="Category" value={parsedData.category} />
              <Tag label="Source" value={parsedData.source} />
              <Tag 
                label="Impact" 
                value={parsedData.excludeFromBalance ? "Info Only" : parsedData.type === 'income' ? "Adds to Balance" : "Debits Balance"} 
                color={parsedData.excludeFromBalance ? "#3b82f6" : parsedData.type === 'income' ? "#10b981" : "#ef4444"}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={confirmCommand} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              <Check size={16} /> Save Transaction
            </button>
            <button onClick={() => { setTranscript(''); setParsedData(null); }} style={{ background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Tag = ({ label, value, color }) => (
  <div style={{ 
    background: 'var(--accent-glow)', 
    padding: '0.25rem 0.75rem', 
    borderRadius: '2rem', 
    fontSize: '0.75rem', 
    border: `1px solid ${color || 'var(--card-border)'}` 
  }}>
    <span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }}>{label}:</span>
    <span style={{ fontWeight: '600', color: color || 'inherit' }}>{value}</span>
  </div>
);

export default VoiceRecorder;
