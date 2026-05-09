import React from 'react';
import { TrendingUp, TrendingDown, Wallet, PieChart as PieIcon, Landmark, Banknote } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = ({ transactions }) => {
  const totalCr = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalDr = transactions
    .filter(t => (t.type === 'expense') && !t.excludeFromBalance)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenseDisplay = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalCr - totalDr;

  const getSourceBalance = (sourceName) => {
    const cr = transactions.filter(t => t.type === 'income' && t.source === sourceName).reduce((sum, t) => sum + t.amount, 0);
    const dr = transactions.filter(t => (t.type === 'expense' || t.type === 'withdrawal') && t.source === sourceName).reduce((sum, t) => sum + t.amount, 0);
    return cr - dr;
  };

  const bobBalance = getSourceBalance('BOB Bank');
  const iciciBalance = getSourceBalance('ICICI Bank');
  const cashBalance = transactions
    .filter(t => t.type === 'income' && t.source === 'Cash').reduce((sum, t) => sum + t.amount, 0)
    - transactions.filter(t => t.type === 'expense' && t.source === 'Cash').reduce((sum, t) => sum + t.amount, 0)
    + transactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0);

  const categoryData = {
    labels: ['Wife', 'Son', 'Farm', 'Father', 'Home', 'Investment', 'Mom', 'Rent'],
    datasets: [{
      data: ['Wife', 'Son', 'Farm', 'Father', 'Home', 'Investment', 'Mom', 'Rent'].map(cat => 
        transactions.filter(t => t.category === cat).reduce((sum, t) => sum + t.amount, 0)
      ),
      backgroundColor: [
        '#7c3aed', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#f97316', '#6366f1', '#14b8a6'
      ],
      borderWidth: 0,
    }]
  };

  const chartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#12151c',
        titleColor: '#fff',
        bodyColor: '#94a3b8',
        padding: 12,
        cornerRadius: 12,
        displayColors: false
      }
    },
    maintainAspectRatio: false,
    cutout: '75%'
  };

  return (
    <div>
      <div className="glass-card premium-gradient animate-float" style={{ padding: '2rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
        <p className="stat-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Total Net Wealth</p>
        <h2 style={{ fontSize: '2.5rem', color: 'white', marginTop: '0.5rem' }}>₹{balance.toLocaleString()}</h2>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.5rem 1rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: '600' }}>
            Cr: ₹{totalCr.toLocaleString()}
          </div>
          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '0.5rem 1rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: '600' }}>
            Dr: ₹{totalExpenseDisplay.toLocaleString()}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
         <SourceCard name="BOB BANK" amount={bobBalance} icon={<Landmark size={18} />} color="#3b82f6" />
         <SourceCard name="ICICI BANK" amount={iciciBalance} icon={<Landmark size={18} />} color="#ec4899" />
         <SourceCard name="CASH ACCOUNT" amount={cashBalance} icon={<Banknote size={18} />} color="#10b981" span={2} />
      </div>

      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PieIcon size={20} color="var(--accent-color)" /> Expense Breakdown
        </h3>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ height: '140px', width: '140px' }}>
            <Doughnut data={categoryData} options={chartOptions} />
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {categoryData.labels.slice(0, 6).map((label, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: categoryData.datasets[0].backgroundColor[i] }}></div>
                <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SourceCard = ({ name, amount, icon, color, span = 1 }) => (
  <div className="glass-card" style={{ 
    padding: '1.25rem', 
    gridColumn: span === 2 ? 'span 2' : 'auto',
    borderLeft: `4px solid ${color}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <div>
      <p className="text-xs-bold" style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{name}</p>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>₹{amount.toLocaleString()}</h3>
    </div>
    <div style={{ background: `${color}15`, color: color, padding: '0.75rem', borderRadius: '14px' }}>
      {icon}
    </div>
  </div>
);

export default Dashboard;
