
import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthWrapper } from './components/AuthWrapper';
import LandingPage from './login_ui/landingPage.jsx';
import UserDashboard from './dashboard/homepage.jsx';
import SalesTabs from './salesAndPurchase/tabs.jsx';
import Footer from './footer.jsx';

const { Content } = Layout;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '0px', marginTop: 0 }}>
          <div style={{ background: '#fff', minHeight: 380 }}>
            <Routes>
              <Route 
                path="/" 
                element={
                  <AuthWrapper requireAuth={false}>
                    <LandingPage />
                  </AuthWrapper>
                } 
              />
              <Route 
                path="/profile/*" 
                element={
                  <AuthWrapper requireAuth={true}>
                    <UserDashboard />
                  </AuthWrapper>
                } 
              />
              <Route 
                path="/sales/*" 
                element={
                  <AuthWrapper requireAuth={true}>
                    <SalesTabs />
                  </AuthWrapper>
                } 
              />
            </Routes>
          </div>
        </Content>
        <Footer />
      </Layout>
    </QueryClientProvider>
  );
};

export default App;
