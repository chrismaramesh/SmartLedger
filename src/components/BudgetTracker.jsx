import React, { useState } from 'react';
import { CATEGORIES } from '../constants/categories';
import { AlertTriangle, CheckCircle, Sliders, Check } from 'lucide-react';

export const BudgetTracker = ({ transactions = [], budgets = {}, onUpdateBudget }) => {
  const [editingCategory, setEditingCategory] = useState(null);
  const [newLimit, setNewLimit] = useState('');

  // Calculate expenses by category for the current month (or all transactions)
  const categorySpending = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => {
      const cat = tx.category || 'other_expense';
      acc[cat] = (acc[cat] || 0) + (Number(tx.amount) || 0);
      return acc;
    }, {});

  const handleStartEdit = (catId, currentVal) => {
    setEditingCategory(catId);
    setNewLimit(currentVal || 0);
  };

  const handleSaveBudget = (catId) => {
    const parsed = parseFloat(newLimit);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateBudget({
        ...budgets,
        [catId]: parsed
      });
    }
    setEditingCategory(null);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="dashboard-card">
      <div className="card-header-flex">
        <div>
          <h2 className="card-heading">Monthly Budget Tracker</h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Monitor expense caps & spending progress across categories
          </p>
        </div>
      </div>

      <div className="budget-list">
        {CATEGORIES.EXPENSE.map(category => {
          const spent = categorySpending[category.id] || 0;
          const limit = budgets[category.id] !== undefined ? budgets[category.id] : 300;
          const percentage = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
          const isOverBudget = spent > limit && limit > 0;
          const isWarning = percentage >= 80 && !isOverBudget;
          const remaining = limit - spent;

          // Progress bar color
          let progressColor = 'var(--income)';
          if (isOverBudget) progressColor = 'var(--expense)';
          else if (isWarning) progressColor = 'var(--warning)';

          return (
            <div key={category.id} className="budget-item">
              <div className="budget-info-row">
                <span className="budget-category-name">
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: category.color }} />
                  {category.name}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {editingCategory === category.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <input
                        type="number"
                        className="form-input"
                        style={{ width: '90px', padding: '0.2rem 0.4rem', fontSize: '0.8rem' }}
                        value={newLimit}
                        onChange={e => setNewLimit(e.target.value)}
                        autoFocus
                      />
                      <button
                        className="btn-icon-subtle"
                        onClick={() => handleSaveBudget(category.id)}
                        style={{ color: 'var(--income)' }}
                        title="Save budget limit"
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  ) : (
                    <span className="budget-amounts">
                      {formatCurrency(spent)} <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>/ {formatCurrency(limit)}</span>
                      <button 
                        className="btn-icon-subtle" 
                        style={{ display: 'inline-flex', marginLeft: '0.35rem', verticalAlign: 'middle', width: '22px', height: '22px' }}
                        onClick={() => handleStartEdit(category.id, limit)}
                        title="Edit budget limit"
                      >
                        <Sliders size={13} />
                      </button>
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="progress-track">
                <div 
                  className="progress-fill"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: progressColor
                  }}
                />
              </div>

              {/* Subtitle Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: isOverBudget ? 'var(--expense)' : 'var(--text-muted)', fontWeight: isOverBudget ? 700 : 500 }}>
                  {isOverBudget ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <AlertTriangle size={13} /> Over budget by {formatCurrency(Math.abs(remaining))}!
                    </span>
                  ) : (
                    <span>{percentage}% utilized ({formatCurrency(remaining)} remaining)</span>
                  )}
                </span>
                <span style={{ color: 'var(--text-dim)' }}>
                  {limit === 0 ? 'No limit set' : `${formatCurrency(limit)} cap`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
