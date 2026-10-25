/**
 * SmartLedger API Service
 * 
 * This service is pre-architected to connect seamlessly to a 
 * Java Spring Boot REST API + MySQL database backend in subsequent steps.
 * 
 * Default Spring Boot URL: http://localhost:8080/api/v1
 * 
 * Spring Boot Entity Mapping Expectation:
 *   @Entity
 *   @Table(name = "transactions")
 *   public class Transaction {
 *       @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
 *       private Long id;
 *       private String title;
 *       private BigDecimal amount;
 *       private String type; // "income" or "expense"
 *       private String category;
 *       private LocalDate date;
 *       private String paymentMethod;
 *       private String notes;
 *   }
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const apiService = {
  // Check if Spring Boot backend is reachable
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3000)
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  // Fetch all transactions from Spring Boot (GET /api/v1/transactions)
  async getTransactions() {
    const res = await fetch(`${API_BASE_URL}/transactions`);
    if (!res.ok) throw new Error(`Failed to fetch transactions: ${res.statusText}`);
    return await res.json();
  },

  // Create a transaction in Spring Boot (POST /api/v1/transactions)
  async createTransaction(transaction) {
    const res = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
    if (!res.ok) throw new Error(`Failed to create transaction: ${res.statusText}`);
    return await res.json();
  },

  // Update a transaction (PUT /api/v1/transactions/{id})
  async updateTransaction(id, transaction) {
    const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
    if (!res.ok) throw new Error(`Failed to update transaction: ${res.statusText}`);
    return await res.json();
  },

  // Delete a transaction (DELETE /api/v1/transactions/{id})
  async deleteTransaction(id) {
    const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`Failed to delete transaction: ${res.statusText}`);
    return true;
  },

  // Fetch category budgets (GET /api/v1/budgets)
  async getBudgets() {
    const res = await fetch(`${API_BASE_URL}/budgets`);
    if (!res.ok) throw new Error(`Failed to fetch budgets: ${res.statusText}`);
    return await res.json();
  },

  // Update category budgets (PUT /api/v1/budgets)
  async updateBudgets(budgets) {
    const res = await fetch(`${API_BASE_URL}/budgets`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budgets)
    });
    if (!res.ok) throw new Error(`Failed to update budgets: ${res.statusText}`);
    return await res.json();
  }
};
