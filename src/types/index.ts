export type DeviceMode = 'iphone' | 'android' | 'tablet' | 'responsive';

export type TabType = 'home' | 'sales' | 'customers' | 'debts' | 'more';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalDebt: number;
  creditLimit: number;
  lastTransactionDate: string;
  notes?: string;
  address?: string;
}

export interface Transaction {
  id: string;
  type: 'sale' | 'purchase' | 'collection' | 'debt_addition';
  title: string;
  partyName: string; // Customer or Supplier
  amount: number; // positive for income, negative or displayed differently
  isDebit?: boolean; // true for negative / expense like purchase
  date: string; // e.g. "اليوم" or "أمس" or formatted
  time: string; // e.g. "10:24 ص"
  fullTimestamp: string;
  status: 'completed' | 'pending';
  invoiceNumber?: string;
  items?: Array<{ name: string; quantity: number; price: number }>;
  paymentMethod?: 'cash' | 'credit' | 'transfer';
}

export interface DebtPayment {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  day: string; // e.g. "الجمعة"
  date: string; // e.g. "2026/09/25"
  time: string; // e.g. "10:30 م"
  remainingDebtAfter: number;
  receiptNumber?: string;
  notes?: string;
  collectedBy?: string;
  timestamp: string; // ISO string
}

export interface Product {
  id: string;
  name: string;
  barcode: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  unit: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'debt' | 'sale' | 'stock' | 'system';
}

export interface StoreInfo {
  id: string;
  name: string;
  branch: string;
  phone: string;
  currency: string;
}

export interface ChartDayData {
  day: string;
  dayShort: string;
  sales: number;
  collections: number;
}
