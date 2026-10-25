import React from 'react';
import { LayoutDashboard, ReceiptText, PieChart, BarChart3, Database, X } from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose, onOpenBackendGuide }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'budgets', label: 'Budget Planner', icon: PieChart },
    { id: 'analytics', label: 'Analytics & Charts', icon: BarChart3 }
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    if (window.innerWidth <= 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 39,
            display: 'block'
          }}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="brand-icon-box" style={{ width: '32px', height: '32px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>SmartLedger</span>
          </div>
          <button 
            className="btn-icon-subtle" 
            onClick={onClose}
            style={{ color: '#94a3b8', display: 'flex' }}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', padding: '0.25rem 0.75rem 0.5rem', fontWeight: 700 }}>
            Main Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleSelect(item.id)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', padding: '1.25rem 0.75rem 0.5rem', fontWeight: 700 }}>
            Architecture
          </div>
          <button
            className="nav-item"
            onClick={() => {
              onOpenBackendGuide();
              if (window.innerWidth <= 1024) onClose();
            }}
          >
            <Database size={19} />
            <span>Spring Boot + MySQL</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="backend-pill">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="status-indicator ready" />
              <span>Frontend V1.0 Ready</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Vite React</span>
          </div>
        </div>
      </aside>
    </>
  );
};
