// Realistic sample data for the initial UI preview.
// Clearly marked with isSample: true so the user can easily clear or toggle it.

export const SAMPLE_BUDGETS = {
  housing: 1400,
  food: 550,
  utilities: 220,
  transportation: 250,
  healthcare: 120,
  entertainment: 180,
  shopping: 200,
  education: 150,
  subscriptions: 60,
  other_expense: 100
};

export const SAMPLE_TRANSACTIONS = [
  {
    id: 'sample-1',
    isSample: true,
    title: 'Monthly Tech Salary',
    amount: 5200.00,
    type: 'income',
    category: 'salary',
    date: '2026-10-01',
    paymentMethod: 'Bank Transfer',
    notes: 'Direct deposit from Acme Corp'
  },
  {
    id: 'sample-2',
    isSample: true,
    title: 'Apartment Rent',
    amount: 1350.00,
    type: 'expense',
    category: 'housing',
    date: '2026-10-02',
    paymentMethod: 'Bank Transfer',
    notes: 'October monthly rental payment'
  },
  {
    id: 'sample-3',
    isSample: true,
    title: 'Freelance Web Design',
    amount: 850.00,
    type: 'income',
    category: 'freelance',
    date: '2026-10-05',
    paymentMethod: 'UPI / Digital Wallet',
    notes: 'Landing page redesign for local cafe'
  },
  {
    id: 'sample-4',
    isSample: true,
    title: 'Whole Foods Grocery Run',
    amount: 142.50,
    type: 'expense',
    category: 'food',
    date: '2026-10-08',
    paymentMethod: 'Credit Card',
    notes: 'Weekly fresh groceries and household essentials'
  },
  {
    id: 'sample-5',
    isSample: true,
    title: 'Electric & Water Utilities',
    amount: 168.20,
    type: 'expense',
    category: 'utilities',
    date: '2026-10-10',
    paymentMethod: 'Debit Card',
    notes: 'City power & utility district bill'
  },
  {
    id: 'sample-6',
    isSample: true,
    title: 'Stock Dividend Yield',
    amount: 195.40,
    type: 'income',
    category: 'investments',
    date: '2026-10-14',
    paymentMethod: 'Bank Transfer',
    notes: 'Q3 index fund dividends'
  },
  {
    id: 'sample-7',
    isSample: true,
    title: 'Subway & Gas Refill',
    amount: 65.00,
    type: 'expense',
    category: 'transportation',
    date: '2026-10-16',
    paymentMethod: 'Credit Card',
    notes: 'Fuel and public transit card reload'
  },
  {
    id: 'sample-8',
    isSample: true,
    title: 'Cloud Hosting & GitHub Pro',
    amount: 45.00,
    type: 'expense',
    category: 'subscriptions',
    date: '2026-10-18',
    paymentMethod: 'Credit Card',
    notes: 'Monthly dev tools & server charges'
  },
  {
    id: 'sample-9',
    isSample: true,
    title: 'Dinner at Italian Bistro',
    amount: 84.60,
    type: 'expense',
    category: 'food',
    date: '2026-10-21',
    paymentMethod: 'Debit Card',
    notes: 'Weekend dinner with family'
  },
  {
    id: 'sample-10',
    isSample: true,
    title: 'Online React & Spring Boot Masterclass',
    amount: 79.99,
    type: 'expense',
    category: 'education',
    date: '2026-10-23',
    paymentMethod: 'Credit Card',
    notes: 'Full-stack engineering certification'
  }
];
