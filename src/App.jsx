
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AuthWrapper from './components/AuthWrapper';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './components/Dashboard/Dashboard';

// Management Components
import SalesManagement from './components/Sales/SalesManagement';
import InventoryManagement from './components/Inventory/InventoryManagement';
import PurchaseManagement from './components/Purchase/PurchaseManagement';

// Individual Components
import CustomersList from './components/Sales/CustomersList';
import SalesOrdersList from './components/Sales/SalesOrdersList';
import QuotationForm from './components/Sales/QuotationForm';

import ItemsList from './components/Inventory/ItemsList';
import WarehousesList from './components/Inventory/WarehousesList';

import SuppliersList from './components/Purchase/SuppliersList';
import PurchaseOrdersList from './components/Purchase/PurchaseOrdersList';
import GoodsReceiptsList from './components/Purchase/GoodsReceiptsList';

import ReportsPage from './components/Reports/ReportsPage';
import UserRolesList from './components/Admin/UserRolesList';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthWrapper>
          <Routes>
            <Route path="/" element={<Navigate to="/profile/dashboard" replace />} />
            
            <Route path="/profile" element={<AppLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Sales Routes */}
              <Route path="sales" element={<SalesManagement />} />
              <Route path="sales/customers" element={<CustomersList />} />
              <Route path="sales/orders" element={<SalesOrdersList />} />
              <Route path="quotation" element={<QuotationForm />} />
              
              {/* Inventory Routes */}
              <Route path="inventory" element={<InventoryManagement />} />
              <Route path="inventory/items" element={<ItemsList />} />
              <Route path="inventory/warehouses" element={<WarehousesList />} />
              
              {/* Purchase Routes */}
              <Route path="purchase" element={<PurchaseManagement />} />
              <Route path="purchase/suppliers" element={<SuppliersList />} />
              <Route path="purchase/orders" element={<PurchaseOrdersList />} />
              <Route path="purchase/receipts" element={<GoodsReceiptsList />} />

              {/* Reports Routes */}
              <Route path="reports/inventory" element={<ReportsPage />} />
              <Route path="reports/sales" element={<ReportsPage />} />
              <Route path="reports/purchase" element={<ReportsPage />} />

              {/* Administration Routes */}
              <Route path="admin/users" element={<UserRolesList />} />
            </Route>

            <Route path="*" element={<Navigate to="/profile/dashboard" replace />} />
          </Routes>
        </AuthWrapper>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
