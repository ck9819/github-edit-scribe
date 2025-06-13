
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import AuthWrapper from './components/AuthWrapper';
import LandingPage from './login_ui/landingPage';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './components/Dashboard/Dashboard';
import ItemsList from './components/Inventory/ItemsList';
import WarehousesList from './components/Inventory/WarehousesList';
import SuppliersList from './components/Purchase/SuppliersList';
import PurchaseOrdersList from './components/Purchase/PurchaseOrdersList';
import GoodsReceiptsList from './components/Purchase/GoodsReceiptsList';
import CustomersList from './components/Sales/CustomersList';
import SalesOrdersList from './components/Sales/SalesOrdersList';
import ReportsPage from './components/Reports/ReportsPage';
import UserRolesList from './components/Admin/UserRolesList';
import ProfilePage from './components/Profile/ProfilePage';
import './App.css';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
          },
        }}
      >
        <AuthWrapper>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/profile" element={<AppLayout />}>
              <Route index element={<Navigate to="/profile/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="inventory/items" element={<ItemsList />} />
              <Route path="inventory/warehouses" element={<WarehousesList />} />
              <Route path="purchase/suppliers" element={<SuppliersList />} />
              <Route path="purchase/orders" element={<PurchaseOrdersList />} />
              <Route path="purchase/receipts" element={<GoodsReceiptsList />} />
              <Route path="sales/customers" element={<CustomersList />} />
              <Route path="sales/orders" element={<SalesOrdersList />} />
              <Route path="reports/inventory" element={<ReportsPage />} />
              <Route path="reports/sales" element={<ReportsPage />} />
              <Route path="reports/purchase" element={<ReportsPage />} />
              <Route path="admin/users" element={<UserRolesList />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<ProfilePage />} />
            </Route>
          </Routes>
        </AuthWrapper>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
