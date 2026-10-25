# SmartLedger - Modern Accounting & Financial Web App

SmartLedger is a full-stack accounting web application designed with a high-performance **React.js + Vite** frontend, prepared for seamless integration with a **Java Spring Boot REST API** and **MySQL** database.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (Installed: `v24.15.0`)
- **npm**: v9.0.0 or later (Installed: `11.12.1`)

### 2. Run Locally in Development Mode
In your terminal inside the `SmartLedger` folder:
```bash
npm run dev
```
The application will launch automatically at:
**[http://localhost:3000](http://localhost:3000)**

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 📱 Responsive Device Support
- **Laptop / Desktop**: Full-width executive dashboard, sidebar navigation, multi-column metrics, and expanded tabular ledger.
- **Redmi 10A Android (~360px viewport)**: Touch-friendly cards (>=44px touch targets), compact spacing, bottom navigation bar.
- **iPhone 11 Safari (~375px-414px viewport)**: iOS notch and home indicator safe-area padding (`env(safe-area-inset-bottom)`), smooth rubber-band scrolling, and modal slide-ins.

---

## 🌟 Key Features
1. **Summary Cards**: Real-time totals for Total Income, Total Expenses, Net Balance (Cashflow Surplus/Deficit), and Monthly Savings Rate.
2. **Transaction Management**: Record, edit, and delete income and expense transactions with validation.
3. **Transaction History & Filter**: Instant search by description, merchant, or notes; filter by type (Income/Expense) and category; sort by date or amount; one-click CSV export.
4. **Income & Expense Categories**: Color-coded categories with visual badges.
5. **Monthly Budget Tracking**: Category-by-category expense tracking with animated progress bars (Green < 75%, Amber 75-99%, Red >= 100% Alert) and inline budget limit editing.
6. **Financial Charts**: Monthly cashflow bar comparison and top expense distribution breakdown.
7. **Sample vs. Real Data Isolation**: Clear banner distinguishing demo preview data from user-saved transactions.

---

## 🏛️ Full-Stack Spring Boot + MySQL Architecture
The frontend service layer is located at `src/services/apiService.js`. When you are ready to build the backend:
- Default Spring Boot Endpoint: `http://localhost:8080/api/v1`
- Includes pre-configured endpoints:
  - `GET /api/v1/transactions`
  - `POST /api/v1/transactions`
  - `PUT /api/v1/transactions/{id}`
  - `DELETE /api/v1/transactions/{id}`
  - `GET /api/v1/budgets`
  - `PUT /api/v1/budgets`
