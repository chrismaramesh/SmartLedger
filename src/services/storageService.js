import { SAMPLE_TRANSACTIONS, SAMPLE_BUDGETS } from '../data/sampleData';

const KEYS = {
  DATA_MODE: 'smartledger_data_mode', // 'sample' | 'real'
  REAL_TRANSACTIONS: 'smartledger_real_transactions',
  REAL_BUDGETS: 'smartledger_real_budgets',
  SAMPLE_CUSTOM_TRANSACTIONS: 'smartledger_sample_transactions',
  SAMPLE_CUSTOM_BUDGETS: 'smartledger_sample_budgets'
};

export const storageService = {
  // Get current active mode: 'sample' or 'real'
  getDataMode() {
    const mode = localStorage.getItem(KEYS.DATA_MODE);
    return mode === 'real' ? 'real' : 'sample'; // defaults to sample on initial preview
  },

  // Switch between sample preview mode and real data mode
  setDataMode(mode) {
    localStorage.setItem(KEYS.DATA_MODE, mode);
  },

  // Fetch transactions based on mode
  getTransactions(mode = this.getDataMode()) {
    if (mode === 'sample') {
      const stored = localStorage.getItem(KEYS.SAMPLE_CUSTOM_TRANSACTIONS);
      return stored ? JSON.parse(stored) : SAMPLE_TRANSACTIONS;
    } else {
      const stored = localStorage.getItem(KEYS.REAL_TRANSACTIONS);
      return stored ? JSON.parse(stored) : [];
    }
  },

  // Save full transaction list for current mode
  saveTransactions(transactions, mode = this.getDataMode()) {
    const key = mode === 'sample' ? KEYS.SAMPLE_CUSTOM_TRANSACTIONS : KEYS.REAL_TRANSACTIONS;
    localStorage.setItem(key, JSON.stringify(transactions));
  },

  // Add a single transaction
  addTransaction(newTx, mode = this.getDataMode()) {
    const list = this.getTransactions(mode);
    const item = {
      ...newTx,
      id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      isSample: mode === 'sample'
    };
    const updated = [item, ...list];
    this.saveTransactions(updated, mode);
    return updated;
  },

  // Update an existing transaction
  updateTransaction(id, updatedFields, mode = this.getDataMode()) {
    const list = this.getTransactions(mode);
    const updated = list.map(tx => tx.id === id ? { ...tx, ...updatedFields } : tx);
    this.saveTransactions(updated, mode);
    return updated;
  },

  // Delete a transaction
  deleteTransaction(id, mode = this.getDataMode()) {
    const list = this.getTransactions(mode);
    const updated = list.filter(tx => tx.id !== id);
    this.saveTransactions(updated, mode);
    return updated;
  },

  // Fetch budgets
  getBudgets(mode = this.getDataMode()) {
    if (mode === 'sample') {
      const stored = localStorage.getItem(KEYS.SAMPLE_CUSTOM_BUDGETS);
      return stored ? JSON.parse(stored) : SAMPLE_BUDGETS;
    } else {
      const stored = localStorage.getItem(KEYS.REAL_BUDGETS);
      return stored ? JSON.parse(stored) : SAMPLE_BUDGETS; // default budget caps
    }
  },

  // Save budgets
  saveBudgets(budgets, mode = this.getDataMode()) {
    const key = mode === 'sample' ? KEYS.SAMPLE_CUSTOM_BUDGETS : KEYS.REAL_BUDGETS;
    localStorage.setItem(key, JSON.stringify(budgets));
  },

  // Reset sample data back to original factory demo
  resetSampleData() {
    localStorage.removeItem(KEYS.SAMPLE_CUSTOM_TRANSACTIONS);
    localStorage.removeItem(KEYS.SAMPLE_CUSTOM_BUDGETS);
    return SAMPLE_TRANSACTIONS;
  },

  // Clear real user data completely
  clearRealData() {
    localStorage.removeItem(KEYS.REAL_TRANSACTIONS);
    return [];
  }
};
