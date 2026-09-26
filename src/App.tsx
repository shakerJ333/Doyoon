import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DeviceFrame } from './components/DeviceFrame';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/tabs/HomeTab';
import { SalesTab } from './components/tabs/SalesTab';
import { CustomersTab } from './components/tabs/CustomersTab';
import { DebtsTab } from './components/tabs/DebtsTab';
import { MoreTab } from './components/tabs/MoreTab';

// Modals
import { NewSaleModal } from './components/modals/NewSaleModal';
import { AddPurchaseModal } from './components/modals/AddPurchaseModal';
import { AddCustomerModal } from './components/modals/AddCustomerModal';
import { ProductsModal } from './components/modals/ProductsModal';
import { ReportsModal } from './components/modals/ReportsModal';
import { DebtReminderModal } from './components/modals/DebtReminderModal';
import { StoreSwitcherModal } from './components/modals/StoreSwitcherModal';
import { NotificationsModal } from './components/modals/NotificationsModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { CustomerLedgerModal } from './components/modals/CustomerLedgerModal';

const MainScreen: React.FC = () => {
  const { activeTab, activeModal } = useApp();

  return (
    <DeviceFrame>
      <div className="flex flex-col min-h-full bg-slate-50">
        {/* Header matching royal blue gradient, notifications, store selector */}
        <Header />

        {/* Tab Content Body */}
        <main className="flex-1">
          {activeTab === 'home' && <HomeTab />}
          {activeTab === 'sales' && <SalesTab />}
          {activeTab === 'customers' && <CustomersTab />}
          {activeTab === 'debts' && <DebtsTab />}
          {activeTab === 'more' && <MoreTab />}
        </main>

        {/* Bottom Navigation Bar */}
        <BottomNav />
      </div>

      {/* Global Modals */}
      {activeModal === 'new_sale' && <NewSaleModal />}
      {activeModal === 'add_purchase' && <AddPurchaseModal />}
      {activeModal === 'add_customer' && <AddCustomerModal />}
      {activeModal === 'products' && <ProductsModal />}
      {activeModal === 'reports' && <ReportsModal />}
      {activeModal === 'debt_reminder' && <DebtReminderModal />}
      {activeModal === 'store_switcher' && <StoreSwitcherModal />}
      {activeModal === 'notifications' && <NotificationsModal />}
      {activeModal === 'settings' && <SettingsModal />}
      {activeModal === 'view_receipt' && <ReceiptModal />}
      {activeModal === 'customer_ledger' && <CustomerLedgerModal />}
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainScreen />
    </AppProvider>
  );
}
