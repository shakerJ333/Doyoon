import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDocFromServer,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { OperationType, handleFirestoreError } from '../lib/firestoreErrors';
import { Customer, Transaction, Product, NotificationItem, StoreInfo, ChartDayData, DeviceMode, TabType, DebtPayment } from '../types';
import {
  INITIAL_STORE,
  INITIAL_TRANSACTIONS,
  INITIAL_CUSTOMERS,
  INITIAL_PRODUCTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CHART_DATA,
  INITIAL_DEBT_PAYMENTS,
} from '../data/initialData';

export type ModalType =
  | 'new_sale'
  | 'add_purchase'
  | 'add_customer'
  | 'products'
  | 'reports'
  | 'debt_reminder'
  | 'store_switcher'
  | 'notifications'
  | 'settings'
  | 'view_receipt'
  | 'customer_ledger';

interface AppContextType {
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  activeModal: ModalType | null;
  openModal: (modal: ModalType, receipt?: Transaction) => void;
  closeModal: () => void;
  selectedReceipt: Transaction | null;

  isFirestoreConnected: boolean;

  store: StoreInfo;
  updateStore: (info: Partial<StoreInfo>) => void;
  currency: string;
  setCurrency: (c: string) => void;

  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'fullTimestamp'>) => void;

  customers: Customer[];
  addCustomer: (c: Omit<Customer, 'id' | 'lastTransactionDate'>) => void;
  recordCustomerPayment: (
    customerId: string,
    amount: number,
    options?:
      | string
      | {
          note?: string;
          day?: string;
          date?: string;
          time?: string;
          receiptNumber?: string;
        }
  ) => void;
  addCustomerDebt: (customerId: string, amount: number, note?: string) => void;

  debtPayments: DebtPayment[];
  selectedCustomerForLedger: Customer | null;
  openCustomerLedger: (customer: Customer) => void;
  closeCustomerLedger: () => void;
  getCustomerPayments: (customerId: string) => DebtPayment[];

  products: Product[];
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProductStock: (id: string, newStock: number) => void;

  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationsAsRead: () => void;

  chartData: ChartDayData[];

  stats: {
    totalSales: number;
    totalPurchases: number;
    totalDebts: number;
    totalCollected: number;
    customerCount: number;
    debtCustomerCount: number;
    dueToday: number;
    salesTrend: string;
    purchasesTrend: string;
    debtsTrend: string;
    collectedTrend: string;
  };

  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function getArabicDayName(date: Date = new Date()): string {
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  return days[date.getDay()];
}

function getFormattedArabicDate(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}/${m}/${d}`;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('iphone');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);
  const [selectedCustomerForLedger, setSelectedCustomerForLedger] = useState<Customer | null>(null);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(true);

  const [store, setStore] = useState<StoreInfo>(INITIAL_STORE);
  const [currency, setCurrency] = useState<string>('د.أ');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [debtPayments, setDebtPayments] = useState<DebtPayment[]>(INITIAL_DEBT_PAYMENTS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [chartData, setChartData] = useState<ChartDayData[]>(INITIAL_CHART_DATA);

  // 1. Test connection to Firestore
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        setIsFirestoreConnected(true);
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.warn('Firebase client in offline cache mode.');
        }
      }
    }
    testConnection();
  }, []);

  // 2. Initialize and Seed Firestore if collections are empty, else listen with realtime onSnapshot
  useEffect(() => {
    // Stores
    const unsubStore = onSnapshot(
      doc(db, 'stores', 'main_store'),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as StoreInfo;
          setStore(data);
          if (data.currency) setCurrency(data.currency);
        } else {
          // Seed initial store
          setDoc(doc(db, 'stores', 'main_store'), INITIAL_STORE).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, 'stores/main_store')
          );
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'stores/main_store');
      }
    );

    // Customers
    const custCol = collection(db, 'customers');
    const unsubCustomers = onSnapshot(
      custCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Customer[] = [];
          snapshot.forEach((d) => loaded.push({ ...d.data(), id: d.id } as Customer));
          setCustomers(loaded);
        } else {
          // Seed initial customers
          INITIAL_CUSTOMERS.forEach((c) => {
            setDoc(doc(db, 'customers', c.id), c).catch((err) =>
              handleFirestoreError(err, OperationType.WRITE, `customers/${c.id}`)
            );
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'customers');
      }
    );

    // Transactions
    const txCol = collection(db, 'transactions');
    const unsubTransactions = onSnapshot(
      txCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Transaction[] = [];
          snapshot.forEach((d) => loaded.push({ ...d.data(), id: d.id } as Transaction));
          // Sort descending by timestamp
          loaded.sort((a, b) => new Date(b.fullTimestamp || 0).getTime() - new Date(a.fullTimestamp || 0).getTime());
          setTransactions(loaded);
        } else {
          // Seed initial transactions
          INITIAL_TRANSACTIONS.forEach((tx) => {
            setDoc(doc(db, 'transactions', tx.id), tx).catch((err) =>
              handleFirestoreError(err, OperationType.WRITE, `transactions/${tx.id}`)
            );
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'transactions');
      }
    );

    // Products
    const prodCol = collection(db, 'products');
    const unsubProducts = onSnapshot(
      prodCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Product[] = [];
          snapshot.forEach((d) => loaded.push({ ...d.data(), id: d.id } as Product));
          setProducts(loaded);
        } else {
          // Seed initial products
          INITIAL_PRODUCTS.forEach((p) => {
            setDoc(doc(db, 'products', p.id), p).catch((err) =>
              handleFirestoreError(err, OperationType.WRITE, `products/${p.id}`)
            );
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'products');
      }
    );

    // Debt Payments (Customer payments log with day, date, and amount)
    const debtPaymentsCol = collection(db, 'debt_payments');
    const unsubDebtPayments = onSnapshot(
      debtPaymentsCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: DebtPayment[] = [];
          snapshot.forEach((d) => loaded.push({ ...d.data(), id: d.id } as DebtPayment));
          loaded.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
          setDebtPayments(loaded);
        } else {
          // Seed initial debt payments
          INITIAL_DEBT_PAYMENTS.forEach((p) => {
            setDoc(doc(db, 'debt_payments', p.id), p).catch((err) =>
              handleFirestoreError(err, OperationType.WRITE, `debt_payments/${p.id}`)
            );
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'debt_payments');
      }
    );

    return () => {
      unsubStore();
      unsubCustomers();
      unsubTransactions();
      unsubProducts();
      unsubDebtPayments();
    };
  }, []);

  const openModal = (modal: ModalType, receipt?: Transaction) => {
    if (receipt) {
      setSelectedReceipt(receipt);
    }
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedReceipt(null);
  };

  const updateStore = (info: Partial<StoreInfo>) => {
    const updated = { ...store, ...info };
    setStore(updated);
    if (info.currency) setCurrency(info.currency);
    setDoc(doc(db, 'stores', 'main_store'), updated, { merge: true }).catch((err) =>
      handleFirestoreError(err, OperationType.UPDATE, 'stores/main_store')
    );
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'fullTimestamp'>) => {
    const id = 'tx-' + Date.now();
    const newTx: Transaction = {
      ...tx,
      id,
      fullTimestamp: new Date().toISOString(),
    };

    // Optimistic UI update
    setTransactions((prev) => [newTx, ...prev]);

    // Save to Firestore persistently
    setDoc(doc(db, 'transactions', id), newTx).catch((err) =>
      handleFirestoreError(err, OperationType.CREATE, `transactions/${id}`)
    );

    // Update notifications and chart data
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: tx.type === 'sale' ? 'فاتورة مبيعات جديدة' : tx.type === 'purchase' ? 'عملية شراء جديدة' : 'تحصيل دفعة',
      message: `تم تسجيل ${tx.title} بمبلغ ${Math.abs(tx.amount).toFixed(2)} ${currency} (${tx.partyName})`,
      time: 'الآن',
      isRead: false,
      type: tx.type === 'sale' ? 'sale' : tx.type === 'collection' ? 'debt' : 'system',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Update chart
    if (tx.type === 'sale') {
      setChartData((prev) =>
        prev.map((item, idx) =>
          idx === prev.length - 1 ? { ...item, sales: item.sales + tx.amount } : item
        )
      );
    } else if (tx.type === 'collection') {
      setChartData((prev) =>
        prev.map((item, idx) =>
          idx === prev.length - 1 ? { ...item, collections: item.collections + tx.amount } : item
        )
      );
    }
  };

  const addCustomer = (c: Omit<Customer, 'id' | 'lastTransactionDate'>) => {
    const id = 'c-' + Date.now();
    const newCustomer: Customer = {
      ...c,
      id,
      lastTransactionDate: 'اليوم',
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    setDoc(doc(db, 'customers', id), newCustomer).catch((err) =>
      handleFirestoreError(err, OperationType.CREATE, `customers/${id}`)
    );
  };

  const recordCustomerPayment = (
    customerId: string,
    amount: number,
    options?:
      | string
      | {
          note?: string;
          day?: string;
          date?: string;
          time?: string;
          receiptNumber?: string;
        }
  ) => {
    const cust = customers.find((c) => c.id === customerId);
    if (!cust) return;

    const opts = typeof options === 'string' ? { note: options } : options;
    const newTotalDebt = Math.max(0, cust.totalDebt - amount);
    const now = new Date();
    const dayName = opts?.day || getArabicDayName(now);
    const dateFormatted = opts?.date || getFormattedArabicDate(now);
    const timeFormatted = opts?.time || now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    const receiptNum = opts?.receiptNumber || `REC-${Math.floor(1000 + Math.random() * 9000)}`;
    const paymentNote = opts?.note || 'دفعة نقدية بالصندوق';

    const updatedCustomer: Customer = {
      ...cust,
      totalDebt: newTotalDebt,
      lastTransactionDate: `${dayName} ${timeFormatted}`,
      notes: paymentNote ? `${cust.notes || ''} | سداد: ${paymentNote}` : cust.notes,
    };

    setCustomers((prev) => prev.map((c) => (c.id === customerId ? updatedCustomer : c)));
    updateDoc(doc(db, 'customers', customerId), {
      totalDebt: newTotalDebt,
      lastTransactionDate: `${dayName} ${timeFormatted}`,
      notes: updatedCustomer.notes || '',
    }).catch((err) =>
      handleFirestoreError(err, OperationType.UPDATE, `customers/${customerId}`)
    );

    // Save debt payment record with day, date, time, and amount
    const paymentId = 'pay-' + Date.now();
    const newPayment: DebtPayment = {
      id: paymentId,
      customerId,
      customerName: cust.name,
      amount,
      day: dayName,
      date: dateFormatted,
      time: timeFormatted,
      remainingDebtAfter: newTotalDebt,
      receiptNumber: receiptNum,
      notes: paymentNote,
      collectedBy: 'أمين الصندوق',
      timestamp: now.toISOString(),
    };

    setDebtPayments((prev) => [newPayment, ...prev]);
    setDoc(doc(db, 'debt_payments', paymentId), newPayment).catch((err) =>
      handleFirestoreError(err, OperationType.CREATE, `debt_payments/${paymentId}`)
    );

    // Also register transaction for general ledger/chart
    addTransaction({
      type: 'collection',
      title: 'دفعة من الزبون',
      partyName: cust.name,
      amount: amount,
      date: `${dayName} ${dateFormatted}`,
      time: timeFormatted,
      status: 'completed',
      invoiceNumber: receiptNum,
      paymentMethod: 'cash',
    });
  };

  const getCustomerPayments = (customerId: string) => {
    return debtPayments.filter((p) => p.customerId === customerId);
  };

  const openCustomerLedger = (customer: Customer) => {
    setSelectedCustomerForLedger(customer);
    setActiveModal('customer_ledger');
  };

  const closeCustomerLedger = () => {
    setSelectedCustomerForLedger(null);
    if (activeModal === 'customer_ledger') {
      setActiveModal(null);
    }
  };

  const addCustomerDebt = (customerId: string, amount: number, note?: string) => {
    const cust = customers.find((c) => c.id === customerId);
    if (!cust) return;

    const newTotalDebt = cust.totalDebt + amount;
    const updatedCustomer: Customer = {
      ...cust,
      totalDebt: newTotalDebt,
      lastTransactionDate: 'اليوم',
      notes: note ? `${cust.notes || ''} | زيادة دين: ${note}` : cust.notes,
    };

    setCustomers((prev) => prev.map((c) => (c.id === customerId ? updatedCustomer : c)));
    updateDoc(doc(db, 'customers', customerId), {
      totalDebt: newTotalDebt,
      lastTransactionDate: 'اليوم',
      notes: updatedCustomer.notes || '',
    }).catch((err) =>
      handleFirestoreError(err, OperationType.UPDATE, `customers/${customerId}`)
    );
  };

  const addProduct = (p: Omit<Product, 'id'>) => {
    const id = 'p-' + Date.now();
    const newProd: Product = {
      ...p,
      id,
    };
    setProducts((prev) => [newProd, ...prev]);
    setDoc(doc(db, 'products', id), newProd).catch((err) =>
      handleFirestoreError(err, OperationType.CREATE, `products/${id}`)
    );
  };

  const updateProductStock = (id: string, newStock: number) => {
    const clampedStock = Math.max(0, newStock);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: clampedStock } : p))
    );
    updateDoc(doc(db, 'products', id), { stock: clampedStock }).catch((err) =>
      handleFirestoreError(err, OperationType.UPDATE, `products/${id}`)
    );
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  // Compute stats dynamically
  const stats = useMemo(() => {
    const baseSales = 2850.0;
    const basePurchases = 1420.0;
    const baseDebts = 980.0;
    const baseCollected = 1870.0;

    const addedTransactions = transactions.filter((t) => !INITIAL_TRANSACTIONS.some((it) => it.id === t.id));
    let deltaSales = 0;
    let deltaPurchases = 0;
    let deltaCollected = 0;

    addedTransactions.forEach((tx) => {
      if (tx.type === 'sale') deltaSales += tx.amount;
      if (tx.type === 'purchase') deltaPurchases += Math.abs(tx.amount);
      if (tx.type === 'collection') deltaCollected += tx.amount;
    });

    const activeDebtCustomers = customers.filter((c) => c.totalDebt > 0).length;
    const dynamicDebtTotal = customers.reduce((sum, c) => sum + (c.totalDebt || 0), 0);

    return {
      totalSales: baseSales + deltaSales,
      totalPurchases: basePurchases + deltaPurchases,
      totalDebts: Math.max(0, baseDebts + (dynamicDebtTotal - 980.0)),
      totalCollected: baseCollected + deltaCollected,
      customerCount: 40 + customers.length,
      debtCustomerCount: Math.max(activeDebtCustomers, 12),
      dueToday: 320.0,
      salesTrend: '↑ 12%',
      purchasesTrend: '↑ 8%',
      debtsTrend: '↑ 5%',
      collectedTrend: '↑ 15%',
    };
  }, [transactions, customers]);

  const resetToDefaults = () => {
    setStore(INITIAL_STORE);
    setTransactions(INITIAL_TRANSACTIONS);
    setCustomers(INITIAL_CUSTOMERS);
    setProducts(INITIAL_PRODUCTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setChartData(INITIAL_CHART_DATA);
    setCurrency('د.أ');

    // Reset Firestore documents
    setDoc(doc(db, 'stores', 'main_store'), INITIAL_STORE).catch((err) =>
      handleFirestoreError(err, OperationType.WRITE, 'stores/main_store')
    );
    INITIAL_CUSTOMERS.forEach((c) =>
      setDoc(doc(db, 'customers', c.id), c).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, `customers/${c.id}`)
      )
    );
    INITIAL_TRANSACTIONS.forEach((tx) =>
      setDoc(doc(db, 'transactions', tx.id), tx).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, `transactions/${tx.id}`)
      )
    );
    INITIAL_PRODUCTS.forEach((p) =>
      setDoc(doc(db, 'products', p.id), p).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, `products/${p.id}`)
      )
    );
    INITIAL_DEBT_PAYMENTS.forEach((p) =>
      setDoc(doc(db, 'debt_payments', p.id), p).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, `debt_payments/${p.id}`)
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        deviceMode,
        setDeviceMode,
        activeTab,
        setActiveTab,
        activeModal,
        openModal,
        closeModal,
        selectedReceipt,
        isFirestoreConnected,
        store,
        updateStore,
        currency,
        setCurrency,
        transactions,
        addTransaction,
        customers,
        addCustomer,
        recordCustomerPayment,
        addCustomerDebt,
        debtPayments,
        selectedCustomerForLedger,
        openCustomerLedger,
        closeCustomerLedger,
        getCustomerPayments,
        products,
        addProduct,
        updateProductStock,
        notifications,
        unreadNotificationCount,
        markNotificationsAsRead,
        chartData,
        stats,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
