import React from 'react';
import { TrendingUp, TrendingDown, Wallet, PieChart as PieIcon } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = ({ transactions }) => {
  const totalCr = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalDr = transactions
    .filter(t => (t.type === 'expense' || t.type === 'withdrawal') && !t.excludeFromBalance)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenseDisplay = transactions
    .filter(t => t.type === 'expense' || t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalCr - totalDr;

  const categoryData = {
    labels: ['Wife', 'Son', 'Farm', 'Father', 'Home', 'Investment', 'Mom'],
    datasets: [{
      data: ['Wife', 'Son', 'Farm', 'Father', 'Home', 'Investment', 'Mom'].map(cat => 
        transactions.filter(t => t.category === cat).reduce((sum, t) => sum + t.amount, 0)
      ),
      backgroundColor: [
        '#7c3aed', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#f97316', '#6366f1'
      ],
      borderWidth: 0,
    }]
  };

  const chartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        padding: 12,
        cornerRadius: 8,
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div>
      <div className="dashboard-grid">
        <StatCard 
          title="Total Credit (Income)" 
          value={`₹${totalCr.toLocaleString()}`} 
          icon={<TrendingUp color="#10b981" />} 
          color="#10b981"
        />
        <StatCard 
          title="Total Expenses" 
          value={`₹${totalExpenseDisplay.toLocaleString()}`} 
          icon={<TrendingDown color="#ef4444" />} 
          color="#ef4444"
        />
        <StatCard 
          title="Current Balance" 
          value={`₹${balance.toLocaleString()}`} 
          icon={<Wallet color="#7c3aed" />} 
          color="#7c3aed"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieIcon size={20} /> Category Split
          </h3>
          <div style={{ height: '200px' }}>
            <Doughnut data={categoryData} options={chartOptions} />
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Monthly Overview</h3>
          <div style={{ height: '200px' }}>
            <Bar 
              data={{
                labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                datasets: [
                  { label: 'Dr', data: [totalDr, 0, 0, 0, 0, 0], backgroundColor: '#ef4444' },
                  { label: 'Cr', data: [totalCr, 0, 0, 0, 0, 0], backgroundColor: '#10b981' }
                ]
              }} 
              options={chartOptions} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="glass-card" style={{ borderLeft: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{title}</p>
        <h2 style={{ fontSize: '1.75rem' }}>{value}</h2>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '1rem' }}>
        {icon}
      </div>
    </div>
  </div>
);

export default Dashboard;
