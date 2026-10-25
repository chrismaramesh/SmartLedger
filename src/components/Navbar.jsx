import React from 'react';
import { Plus, Server, Menu } from 'lucide-react';

export const Navbar = ({ onOpenAddModal, onOpenBackendGuide, onToggleSidebar, dataMode }) => {
  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button 
          className="btn-icon-subtle" 
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          style={{ display: 'inline-flex' }}
        >
          <Menu size={22} />
        </button>
        <div className="brand-badge">
          <div className="brand-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <span>SmartLedger</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button 
          className="btn-secondary"
          onClick={onOpenBackendGuide}
          title="View Spring Boot & MySQL integration blueprint"
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
        >
          <Server size={16} />
          <span style={{ display: 'inline' }}>Spring Boot API</span>
        </button>

        <button 
          className="btn-primary" 
          onClick={onOpenAddModal}
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          <Plus size={18} />
          <span>New Transaction</span>
        </button>
      </div>
    </header>
  );
};
