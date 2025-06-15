
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuth';
import AuthWrapper from './components/AuthWrapper';
import Dashboard from './components/Dashboard/Dashboard';
import CompanyForm from './companyForm';
import PartForm from './partForm';
import ItemList from './itemList';
import CompanyList from './companyList';
import SalesPage from './salesPage';
import QuotationForm from './quotationForm';
import SalesAndPurchase from './salesAndPurchase/tabs';
import QuotationsPage from './salesAndPurchase/quotationPage';
import SalesManagement from './components/Sales/SalesManagement';

const queryClient = new QueryClient();

const AppLayout = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <p>Please log in to access this page.</p>;
  }

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
      <Route path="/items" element={<AppLayout><ItemList /></AppLayout>} />
      <Route path="/companies" element={<AppLayout><CompanyList /></AppLayout>} />
      <Route path="/salespage" element={<AppLayout><SalesPage /></AppLayout>} />
      <Route path="/quotation" element={<AppLayout><QuotationForm /></AppLayout>} />
      <Route path="/salesandpurchase" element={<AppLayout><SalesAndPurchase /></AppLayout>} />
      <Route path="/quotations" element={<AppLayout><QuotationsPage /></AppLayout>} />
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
