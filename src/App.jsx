import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AuthWrapper from './components/AuthWrapper';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './components/Dashboard/Dashboard';
import SalesManagement from './components/Sales/SalesManagement';
import CustomersList from './components/Sales/CustomersList';
import SalesOrdersList from './components/Sales/SalesOrdersList';
import CompanyForm from './salesAndPurchase/companyForm.jsx';
import PartForm from './salesAndPurchase/partsForm.jsx';
import SalesPage from './salesAndPurchase/salesPage.jsx';
import QuotationForm from './components/Sales/QuotationForm';
import SalesAndPurchase from './salesAndPurchase/tabs';

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
              <Route path="sales" element={<SalesManagement />} />
              <Route path="sales/customers" element={<CustomersList />} />
              <Route path="sales/orders" element={<SalesOrdersList />} />
              {/* Add a route for invoices when the component is created */}
              {/* <Route path="sales/invoices" element={<InvoicesList />} /> */}

              {/* Other routes that can now render inside the layout */}
              <Route path="add-company" element={<CompanyForm />} />
              <Route path="add-part" element={<PartForm />} />
              <Route path="salespage" element={<SalesPage />} />
              <Route path="quotation" element={<QuotationForm />} />
              <Route path="salesandpurchase" element={<SalesAndPurchase />} />
            </Route>

            <Route path="*" element={<Navigate to="/profile/dashboard" replace />} />
          </Routes>
        </AuthWrapper>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
