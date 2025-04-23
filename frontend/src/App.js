
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import LandingPage from './login_ui/landingPage';
import UserDashboard from './dashboard/homepage';
import SalesTabs from './salesAndPurchase/tabs';

const { Content } = Layout;

const App = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '0px', marginTop: 0 }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/profile/*" element={<UserDashboard />} />
            <Route path="/sales/*" element={<SalesTabs />} />
          </Routes>
        </div>
      </Content>
    </Layout>
  );
};

export default App;
