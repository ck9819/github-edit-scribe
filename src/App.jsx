import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import AuthWrapper from './components/AuthWrapper';
import LandingPage from './login_ui/landingPage';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './components/Dashboard/Dashboard';
import ItemsList from './components/Inventory/ItemsList';
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
              {/* More routes will be added */}
            </Route>
          </Routes>
        </AuthWrapper>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
