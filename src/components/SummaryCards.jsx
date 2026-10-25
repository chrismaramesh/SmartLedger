import React from 'react';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';

export const SummaryCards = ({ transactions = [] }) => {
  const totals = transactions.reduce(
    (acc, tx) => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        acc.income += amt;
      } else if (tx.type === 'expense') {
        acc.expense += amt;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const netBalance = totals.income - totals.expense;
  const savingsRate = totals.income > 0 
    ? Math.max(0, Math.round(((totals.income - totals.expense) / totals.income) * 100)) 
    : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="summary-grid">
      {/* Total Income */}
      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-title">Total Income</span>
          <div className="summary-icon-box income">
            <TrendingUp size={20} />
          </div>
        </div>
        <div>
          <div className="summary-amount" style={{ color: 'var(--income)' }}>
            {formatCurrency(totals.income)}
          </div>
          <div className="summary-subtitle">
            <span>Incoming revenue & deposits</span>
          </div>
        </div>
      </div>

      {/* Total Expenses */}
      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-title">Total Expenses</span>
          <div className="summary-icon-box expense">
            <TrendingDown size={20} />
          </div>
        </div>
        <div>
          <div className="summary-amount" style={{ color: 'var(--expense)' }}>
            {formatCurrency(totals.expense)}
          </div>
          <div className="summary-subtitle">
            <span>Operating & personal costs</span>
          </div>
        </div>
      </div>

      {/* Net Balance */}
      <div className="summary-card" style={{ borderColor: netBalance >= 0 ? '#c7d2fe' : '#fecdd3' }}>
        <div className="summary-card-header">
          <span className="summary-title">Net Balance</span>
          <div className="summary-icon-box balance">
            <Wallet size={20} />
          </div>
        </div>
        <div>
          <div className="summary-amount" style={{ color: netBalance >= 0 ? 'var(--primary)' : 'var(--expense)' }}>
            {formatCurrency(netBalance)}
          </div>
          <div className="summary-subtitle">
            <span style={{ fontWeight: 600, color: netBalance >= 0 ? 'var(--income)' : 'var(--expense)' }}>
              {netBalance >= 0 ? 'Cashflow Surplus' : 'Operating Deficit'}
            </span>
          </div>
        </div>
      </div>

      {/* Savings Rate */}
      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-title">Savings Rate</span>
          <div className="summary-icon-box savings">
            <PiggyBank size={20} />
          </div>
        </div>
        <div>
          <div className="summary-amount" style={{ color: '#8b5cf6' }}>
            {savingsRate}%
          </div>
          <div className="summary-subtitle">
            <span>Of total monthly income saved</span>
          </div>
        </div>
      </div>
    </div>
  );
};
