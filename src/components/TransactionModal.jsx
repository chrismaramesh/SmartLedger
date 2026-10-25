import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { CATEGORIES, PAYMENT_METHODS } from '../constants/categories';

export const TransactionModal = ({ isOpen, onClose, onSave, editingTransaction }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Credit Card',
    notes: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        title: editingTransaction.title || '',
        amount: editingTransaction.amount || '',
        type: editingTransaction.type || 'expense',
        category: editingTransaction.category || (editingTransaction.type === 'income' ? 'salary' : 'food'),
        date: editingTransaction.date || new Date().toISOString().split('T')[0],
        paymentMethod: editingTransaction.paymentMethod || 'Credit Card',
        notes: editingTransaction.notes || ''
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: 'food',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Credit Card',
        notes: ''
      });
    }
    setError('');
  }, [editingTransaction, isOpen]);

  if (!isOpen) return null;

  const handleTypeChange = (newType) => {
    const defaultCat = newType === 'income' ? CATEGORIES.INCOME[0].id : CATEGORIES.EXPENSE[0].id;
    setFormData(prev => ({
      ...prev,
      type: newType,
      category: defaultCat
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a transaction title or description.');
      return;
    }
    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than zero.');
      return;
    }
    if (!formData.date) {
      setError('Please select a valid transaction date.');
      return;
    }

    onSave({
      ...formData,
      amount: parsedAmount
    });
    onClose();
  };

  const activeCategories = formData.type === 'income' ? CATEGORIES.INCOME : CATEGORIES.EXPENSE;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
            {editingTransaction ? 'Edit Transaction' : 'Record New Transaction'}
          </h2>
          <button className="btn-icon-subtle" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecdd3',
                color: '#991b1b',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.825rem'
              }}>
                {error}
              </div>
            )}

            {/* Income vs Expense Toggle */}
            <div className="type-toggle-group">
              <button
                type="button"
                className={`type-toggle-btn ${formData.type === 'income' ? 'active-income' : ''}`}
                onClick={() => handleTypeChange('income')}
              >
                + Income
              </button>
              <button
                type="button"
                className={`type-toggle-btn ${formData.type === 'expense' ? 'active-expense' : ''}`}
                onClick={() => handleTypeChange('expense')}
              >
                - Expense
              </button>
            </div>

            {/* Description / Title */}
            <div className="form-group">
              <label className="form-label">Description / Merchant</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. October Salary, Grocery Store, Electric Bill"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Amount & Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="form-input"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                {activeCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                className="form-select"
                value={formData.paymentMethod}
                onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                {PAYMENT_METHODS.map(method => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Notes (Optional)</label>
              <textarea
                rows="2"
                className="form-textarea"
                placeholder="Receipt reference, tax tags, or notes..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={18} />
              <span>{editingTransaction ? 'Save Changes' : 'Record Transaction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
