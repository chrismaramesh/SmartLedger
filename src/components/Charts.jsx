import React, { useState } from 'react';
import { CATEGORIES } from '../constants/categories';

export const Charts = ({ transactions = [] }) => {
  const [hoveredBar, setHoveredBar] = useState(null);

  // Group transactions by month (e.g. "Aug", "Sep", "Oct")
  const monthlyData = transactions.reduce((acc, tx) => {
    if (!tx.date) return acc;
    const dateObj = new Date(tx.date);
    const monthKey = dateObj.toLocaleString('en-US', { month: 'short', year: '2-digit' });
    
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, income: 0, expense: 0, timestamp: dateObj.getTime() };
    }
    const amt = Number(tx.amount) || 0;
    if (tx.type === 'income') {
      acc[monthKey].income += amt;
    } else if (tx.type === 'expense') {
      acc[monthKey].expense += amt;
    }
    return acc;
  }, {});

  // Sort chronologically and take last 6 months
  const sortedMonths = Object.values(monthlyData)
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-6);

  // If no transactions yet, show placeholder months
  const displayMonths = sortedMonths.length > 0 ? sortedMonths : [
    { month: 'Current', income: 0, expense: 0 }
  ];

  const maxVal = Math.max(
    ...displayMonths.map(m => Math.max(m.income, m.expense)),
    1000
  );

  // Expense breakdown by category
  const expenseByCategory = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => {
      const catId = tx.category || 'other_expense';
      const amt = Number(tx.amount) || 0;
      acc[catId] = (acc[catId] || 0) + amt;
      return acc;
    }, {});

  const totalExpense = Object.values(expenseByCategory).reduce((sum, v) => sum + v, 0);

  const categoryBreakdown = Object.entries(expenseByCategory)
    .map(([catId, amount]) => {
      const categoryConfig = CATEGORIES.EXPENSE.find(c => c.id === catId) || {
        name: catId,
        color: '#64748b'
      };
      const percentage = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
      return {
        id: catId,
        name: categoryConfig.name,
        color: categoryConfig.color,
        amount,
        percentage
      };
    })
    .sort((a, b) => b.amount - a.amount);

  const formatShortCurrency = (val) => {
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val.toFixed(0)}`;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
      {/* Monthly Cashflow Bar Chart */}
      <div className="dashboard-card" style={{ marginBottom: 0 }}>
        <div className="card-header-flex">
          <div>
            <h3 className="card-heading">Cashflow Comparison</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Income vs Expenses by Month</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--income)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--income)' }} /> Income
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--expense)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--expense)' }} /> Expense
            </span>
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', gap: '1.25rem', padding: '1rem 0.5rem 0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          {displayMonths.map((m, idx) => {
            const incomeHeight = maxVal > 0 ? (m.income / maxVal) * 170 : 0;
            const expenseHeight = maxVal > 0 ? (m.expense / maxVal) * 170 : 0;

            return (
              <div 
                key={idx} 
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', position: 'relative' }}
                onMouseEnter={() => setHoveredBar(idx)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {hoveredBar === idx && (
                  <div style={{
                    position: 'absolute',
                    top: '-32px',
                    backgroundColor: '#0f172a',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                  }}>
                    +${m.income.toFixed(0)} / -${m.expense.toFixed(0)}
                  </div>
                )}
                
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', width: '100%', justifyContent: 'center' }}>
                  {/* Income bar */}
                  <div 
                    style={{
                      width: '42%',
                      maxWidth: '24px',
                      height: `${Math.max(incomeHeight, 4)}px`,
                      backgroundColor: 'var(--income)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.4s ease'
                    }}
                    title={`Income: $${m.income.toFixed(2)}`}
                  />
                  {/* Expense bar */}
                  <div 
                    style={{
                      width: '42%',
                      maxWidth: '24px',
                      height: `${Math.max(expenseHeight, 4)}px`,
                      backgroundColor: 'var(--expense)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.4s ease'
                    }}
                    title={`Expense: $${m.expense.toFixed(2)}`}
                  />
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 600 }}>
                  {m.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expense Distribution by Category */}
      <div className="dashboard-card" style={{ marginBottom: 0 }}>
        <div className="card-header-flex">
          <div>
            <h3 className="card-heading">Expense Distribution</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Top spending categories</p>
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--expense)' }}>
            ${totalExpense.toFixed(2)} Total
          </span>
        </div>

        {categoryBreakdown.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No expenses recorded yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '220px', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {categoryBreakdown.slice(0, 5).map(cat => (
              <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: cat.color }} />
                    {cat.name}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                    ${cat.amount.toFixed(2)} ({cat.percentage}%)
                  </span>
                </div>
                <div style={{ height: '6px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${cat.percentage}%`, height: '100%', backgroundColor: cat.color, borderRadius: '999px' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
