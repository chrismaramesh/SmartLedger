import React, { useState } from 'react';
import { Search, Filter, Edit2, Trash2, ArrowUpDown, Download, Tag, Calendar } from 'lucide-react';
import { CATEGORIES } from '../constants/categories';

export const TransactionList = ({ transactions = [], onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [deletingId, setDeletingId] = useState(null);

  // Filter transactions
  const filtered = transactions.filter(tx => {
    // Search match
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      !term || 
      tx.title.toLowerCase().includes(term) ||
      (tx.notes && tx.notes.toLowerCase().includes(term)) ||
      (tx.paymentMethod && tx.paymentMethod.toLowerCase().includes(term));

    // Type match
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;

    // Category match
    const matchesCategory = categoryFilter === 'all' || tx.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  // Sort transactions
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'amount-high') return Number(b.amount) - Number(a.amount);
    if (sortBy === 'amount-low') return Number(a.amount) - Number(b.amount);
    return 0;
  });

  // Helper to look up category info
  const getCategoryDetails = (type, catId) => {
    const list = type === 'income' ? CATEGORIES.INCOME : CATEGORIES.EXPENSE;
    return list.find(c => c.id === catId) || { name: catId || 'General', color: '#64748b', bgColor: '#f1f5f9' };
  };

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amt);
  };

  const handleExportCSV = () => {
    if (sorted.length === 0) return;
    const headers = ['ID', 'Date', 'Type', 'Title', 'Category', 'Amount', 'Payment Method', 'Notes'];
    const rows = sorted.map(t => [
      t.id,
      t.date,
      t.type,
      `"${t.title.replace(/"/g, '""')}"`,
      t.category,
      t.amount,
      `"${(t.paymentMethod || '').replace(/"/g, '""')}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartledger_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-card">
      <div className="card-header-flex">
        <div>
          <h2 className="card-heading">Transaction Ledger</h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Showing {sorted.length} of {transactions.length} transactions
          </p>
        </div>

        <button 
          className="btn-secondary"
          onClick={handleExportCSV}
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
          disabled={sorted.length === 0}
        >
          <Download size={15} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="filter-bar">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search className="search-icon" size={17} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by title, notes, or payment..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Type Filter */}
        <select 
          className="select-filter"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="income">Income Only (+)</option>
          <option value="expense">Expense Only (-)</option>
        </select>

        {/* Category Filter */}
        <select 
          className="select-filter"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <optgroup label="Income Categories">
            {CATEGORIES.INCOME.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </optgroup>
          <optgroup label="Expense Categories">
            {CATEGORIES.EXPENSE.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </optgroup>
        </select>

        {/* Sort Dropdown */}
        <select 
          className="select-filter"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-high">Amount: High to Low</option>
          <option value="amount-low">Amount: Low to High</option>
        </select>
      </div>

      {/* Confirmation Modal for Delete */}
      {deletingId && (
        <div className="modal-overlay" onClick={() => setDeletingId(null)}>
          <div className="modal-content" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Confirm Delete</h3>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Are you sure you want to delete this transaction? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setDeletingId(null)}>Cancel</button>
              <button 
                className="btn-danger" 
                onClick={() => {
                  onDelete(deletingId);
                  setDeletingId(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render Transactions List */}
      {sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-wrap">
            <Filter size={28} />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            No Transactions Found
          </h3>
          <p style={{ fontSize: '0.85rem' }}>
            {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your search criteria or resetting filters.'
              : 'Add your first transaction using the "+ New Transaction" button above.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="table-responsive" style={{ display: 'none' }} id="desktop-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title / Merchant</th>
                  <th>Category</th>
                  <th>Payment</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(tx => {
                  const cat = getCategoryDetails(tx.type, tx.category);
                  const isIncome = tx.type === 'income';

                  return (
                    <tr key={tx.id}>
                      <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                        {tx.date}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{tx.title}</div>
                        {tx.notes && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {tx.notes}
                          </div>
                        )}
                      </td>
                      <td>
                        <span 
                          className="category-pill"
                          style={{ backgroundColor: cat.bgColor, color: cat.color, border: `1px solid ${cat.color}30` }}
                        >
                          {cat.name}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {tx.paymentMethod || '—'}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }} className={isIncome ? 'amount-income' : 'amount-expense'}>
                        {isIncome ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(tx.amount)}`}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
                          <button 
                            className="btn-icon-subtle" 
                            title="Edit"
                            onClick={() => onEdit(tx)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="btn-icon-subtle delete" 
                            title="Delete"
                            onClick={() => setDeletingId(tx.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Card View (Responsive on Redmi 10A & iPhone 11) */}
          <div className="mobile-tx-list" id="responsive-tx-list">
            {sorted.map(tx => {
              const cat = getCategoryDetails(tx.type, tx.category);
              const isIncome = tx.type === 'income';

              return (
                <div key={tx.id} className="mobile-tx-card">
                  <div 
                    className="tx-icon-circle"
                    style={{ backgroundColor: cat.bgColor, color: cat.color }}
                  >
                    <Tag size={19} />
                  </div>

                  <div className="tx-info-block">
                    <div className="tx-title">{tx.title}</div>
                    <div className="tx-meta">
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span style={{ color: cat.color, fontWeight: 600 }}>{cat.name}</span>
                      {tx.paymentMethod && (
                        <>
                          <span>•</span>
                          <span>{tx.paymentMethod}</span>
                        </>
                      )}
                    </div>
                    {tx.notes && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {tx.notes}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                    <div className={`tx-amount ${isIncome ? 'amount-income' : 'amount-expense'}`}>
                      {isIncome ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(tx.amount)}`}
                    </div>
                    <div className="tx-actions">
                      <button 
                        className="btn-icon-subtle" 
                        onClick={() => onEdit(tx)}
                        aria-label="Edit transaction"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button 
                        className="btn-icon-subtle delete" 
                        onClick={() => setDeletingId(tx.id)}
                        aria-label="Delete transaction"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
