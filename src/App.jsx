
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Remove incorrect import: import { useAuth } from './hooks/useAuth';
// Remove: import AuthWrapper from './AuthContext';
import AuthWrapper from './components/AuthWrapper';
import Dashboard from './components/Dashboard/Dashboard';
import CompanyForm from './salesAndPurchase/companyForm.jsx';
import PartForm from './salesAndPurchase/partsForm.jsx';
import SalesPage from './salesAndPurchase/salesPage.jsx';
// Removed broken import: import QuotationForm from './salesAndPurchase/quotationForm.jsx';
import QuotationForm from './components/Sales/QuotationForm';
import SalesAndPurchase from './salesAndPurchase/tabs';
// Removed broken import: import QuotationsPage from './salesAndPurchase/quotationPage.jsx';
import SalesManagement from './components/Sales/SalesManagement';

const queryClient = new QueryClient();

const AppLayout = ({ children }) => {
  // Removed: const { user } = useAuth();

  // Hide page content until AuthWrapper loading finishes
  // User auth status is managed inside AuthWrapper now
  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome to the App!</h2>
      {children}
    </div>
  );
};

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/add-company" element={<AppLayout><CompanyForm /></AppLayout>} />
      <Route path="/add-part" element={<AppLayout><PartForm /></AppLayout>} />
      <Route path="/salespage" element={<AppLayout><SalesPage /></AppLayout>} />
      <Route path="/quotation" element={<AppLayout><QuotationForm /></AppLayout>} />
      <Route path="/salesandpurchase" element={<AppLayout><SalesAndPurchase /></AppLayout>} />
      {/* Removed broken route: QuotationsPage */}
      <Route path="/sales" element={<AppLayout><SalesManagement /></AppLayout>} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthWrapper>
          <AppContent />
        </AuthWrapper>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
