import React, { useState, useEffect } from 'react';
import { storageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { DataModeBanner } from './components/DataModeBanner';
import { SummaryCards } from './components/SummaryCards';
import { Charts } from './components/Charts';
import { TransactionModal } from './components/TransactionModal';
import { TransactionList } from './components/TransactionList';
import { BudgetTracker } from './components/BudgetTracker';
import { BackendGuideModal } from './components/BackendGuideModal';

export function App() {
  const [dataMode, setDataMode] = useState(storageService.getDataMode());
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isBackendGuideOpen, setIsBackendGuideOpen] = useState(false);

  // Initialize data on load or when data mode changes
  useEffect(() => {
    const loadedTx = storageService.getTransactions(dataMode);
    const loadedBudgets = storageService.getBudgets(dataMode);
    setTransactions(loadedTx);
    setBudgets(loadedBudgets);
  }, [dataMode]);

  // Handle switching between Sample Data and Live User Data
  const handleSwitchDataMode = (newMode) => {
    storageService.setDataMode(newMode);
    setDataMode(newMode);
  };

  // Reset sample data to original preview defaults
  const handleResetSampleData = () => {
    const resetList = storageService.resetSampleData();
    setTransactions(resetList);
    setBudgets(storageService.getBudgets('sample'));
  };

  // Clear real user data
  const handleClearRealData = () => {
    if (window.confirm('Are you sure you want to clear all your saved transactions?')) {
      const emptyList = storageService.clearRealData();
      setTransactions(emptyList);
    }
  };

  // Add or Edit Transaction
  const handleSaveTransaction = (transactionData) => {
    if (editingTransaction) {
      const updated = storageService.updateTransaction(editingTransaction.id, transactionData, dataMode);
      setTransactions(updated);
      setEditingTransaction(null);
    } else {
      const updated = storageService.addTransaction(transactionData, dataMode);
      setTransactions(updated);
    }
  };

  // Delete Transaction
  const handleDeleteTransaction = (id) => {
    const updated = storageService.deleteTransaction(id, dataMode);
    setTransactions(updated);
  };

  // Open Edit Modal
  const handleOpenEdit = (tx) => {
    setEditingTransaction(tx);
    setIsAddModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingTransaction(null);
  };

  // Update Category Budgets
  const handleUpdateBudgets = (newBudgets) => {
    storageService.saveBudgets(newBudgets, dataMode);
    setBudgets(newBudgets);
  };

  return (
    <div className="app-layout">
      {/* Sidebar for Desktop & Collapsible Drawer for Mobile */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenBackendGuide={() => setIsBackendGuideOpen(true)}
      />

      <div className="main-content-wrapper">
        {/* Sticky Top Navigation Bar */}
        <Navbar
          dataMode={dataMode}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenBackendGuide={() => setIsBackendGuideOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        />

        {/* Main Page Body */}
        <main className="page-container">
          {/* Sample Data vs Live Ledger Banner */}
          <DataModeBanner
            dataMode={dataMode}
            onSwitchMode={handleSwitchDataMode}
            onResetSampleData={handleResetSampleData}
            onClearRealData={handleClearRealData}
          />

          {/* VIEW: Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <>
              {/* 1. Summary Cards */}
              <SummaryCards transactions={transactions} />

              {/* 2. Visual Charts */}
              <Charts transactions={transactions} />

              {/* 3. Split: Recent Ledger & Monthly Budget Progress */}
              <div className="dashboard-grid-split">
                <div>
                  <TransactionList
                    transactions={transactions}
                    onEdit={handleOpenEdit}
                    onDelete={handleDeleteTransaction}
                  />
                </div>
                <div>
                  <BudgetTracker
                    transactions={transactions}
                    budgets={budgets}
                    onUpdateBudget={handleUpdateBudgets}
                  />
                </div>
              </div>
            </>
          )}

          {/* VIEW: Dedicated Transactions Ledger */}
          {activeTab === 'transactions' && (
            <div>
              <TransactionList
                transactions={transactions}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteTransaction}
              />
            </div>
          )}

          {/* VIEW: Budget Tracking */}
          {activeTab === 'budgets' && (
            <div>
              <BudgetTracker
                transactions={transactions}
                budgets={budgets}
                onUpdateBudget={handleUpdateBudgets}
              />
            </div>
          )}

          {/* VIEW: Analytics & Visual Breakdown */}
          {activeTab === 'analytics' && (
            <div>
              <SummaryCards transactions={transactions} />
              <Charts transactions={transactions} />
            </div>
          )}
        </main>

        {/* Mobile Tab Bar (For Redmi 10A Android & iPhone 11 Safari) */}
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />
      </div>

      {/* Transaction Add/Edit Modal */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTransaction}
        editingTransaction={editingTransaction}
      />

      {/* Spring Boot & MySQL Architectural Guide Modal */}
      <BackendGuideModal
        isOpen={isBackendGuideOpen}
        onClose={() => setIsBackendGuideOpen(false)}
      />
    </div>
  );
}

export default App;
