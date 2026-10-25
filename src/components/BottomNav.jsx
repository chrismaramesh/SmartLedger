import React from 'react';
import { LayoutDashboard, ReceiptText, PieChart, BarChart3, PlusCircle } from 'lucide-react';

export const BottomNav = ({ activeTab, setActiveTab, onOpenAddModal }) => {
  return (
    <nav className="bottom-nav">
      <button 
        className={`bottom-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
        onClick={() => setActiveTab('dashboard')}
      >
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </button>

      <button 
        className={`bottom-nav-btn ${activeTab === 'transactions' ? 'active' : ''}`}
        onClick={() => setActiveTab('transactions')}
      >
        <ReceiptText size={20} />
        <span>Ledger</span>
      </button>

      {/* Center Quick Add Action */}
      <button 
        className="bottom-nav-btn"
        onClick={onOpenAddModal}
        style={{ color: 'var(--primary)', transform: 'translateY(-4px)' }}
        aria-label="Add Transaction"
      >
        <div style={{
          backgroundColor: 'var(--primary)',
          color: 'white',
          borderRadius: '50%',
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(79, 70, 229, 0.4)'
        }}>
          <PlusCircle size={24} />
        </div>
        <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>Add</span>
      </button>

      <button 
        className={`bottom-nav-btn ${activeTab === 'budgets' ? 'active' : ''}`}
        onClick={() => setActiveTab('budgets')}
      >
        <PieChart size={20} />
        <span>Budgets</span>
      </button>

      <button 
        className={`bottom-nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
        onClick={() => setActiveTab('analytics')}
      >
        <BarChart3 size={20} />
        <span>Charts</span>
      </button>
    </nav>
  );
};
