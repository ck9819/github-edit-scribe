
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AuthWrapper from './components/AuthWrapper';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './components/Dashboard/Dashboard';
import SalesManagement from './components/Sales/SalesManagement';
import CustomersList from './components/Sales/CustomersList';
import SalesOrdersList from './components/Sales/SalesOrdersList';
import QuotationForm from './components/Sales/QuotationForm';

// Inventory Components
import ItemsList from './components/Inventory/ItemsList';
import WarehousesList from './components/Inventory/WarehousesList';

// Purchase Components  
import SuppliersList from './components/Purchase/SuppliersList';
import PurchaseOrdersList from './components/Purchase/PurchaseOrdersList';
import GoodsReceiptsList from './components/Purchase/GoodsReceiptsList';

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
              <Route path="inventory/items" element={<ItemsList />} />
              <Route path="inventory/warehouses" element={<WarehousesList />} />
              
              {/* Purchase Routes */}
              <Route path="purchase/suppliers" element={<SuppliersList />} />
              <Route path="purchase/orders" element={<PurchaseOrdersList />} />
              <Route path="purchase/receipts" element={<GoodsReceiptsList />} />
            </Route>

            <Route path="*" element={<Navigate to="/profile/dashboard" replace />} />
          </Routes>
        </AuthWrapper>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
