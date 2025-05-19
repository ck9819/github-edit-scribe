
// SalesPurchase.js
import React from 'react';
import { Tabs, Layout } from 'antd';
import SalesPage from './salesPage.jsx';
import QuotationsPage from './quotationPage.jsx';
import './sales.css';

const { TabPane } = Tabs;
const { Content } = Layout;

const SalesTabs = () => {
  return (
    <Layout className="sales-layout">
      <Content className="sales-content">
        <div className="page-header">
          <h1>Sales & Purchase</h1>
        </div>
        <Tabs
          defaultActiveKey="1"
          type="card"
          className="sales-tabs"
          items={[
            {
              key: '1',
              label: 'Sales & Purchase',
              children: <SalesPage />
            },
            {
              key: '2',
              label: 'Quotations',
              children: <QuotationsPage />
            },
            {
              key: '3',
              label: 'All Documents',
              children: <QuotationsPage />
            }
          ]}
        />
      </Content>
    </Layout>
  );
};

export default SalesTabs;
