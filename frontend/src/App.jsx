
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import LandingPage from './login_ui/landingPage.jsx';
import UserDashboard from './dashboard/homepage.jsx';
import SalesTabs from './salesAndPurchase/tabs.jsx';
import Footer from './footer.jsx';

const { Content } = Layout;

const App = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '0px', marginTop: 0 }}>
        <div style={{ background: '#fff', minHeight: 380 }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/profile/*" element={<UserDashboard />} />
            <Route path="/sales/*" element={<SalesTabs />} />
          </Routes>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default App;
