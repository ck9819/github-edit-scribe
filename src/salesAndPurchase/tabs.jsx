
import React from 'react';
import { Tabs } from 'antd';
import { ShoppingCartOutlined, FileTextOutlined } from '@ant-design/icons';
import SalesPage from './salesPage';

const { TabPane } = Tabs;

const SalesTabs = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Tabs defaultActiveKey="sales" type="card">
        <TabPane
          tab={
            <span>
              <ShoppingCartOutlined />
              Sales Management
            </span>
          }
          key="sales"
        >
          <SalesPage />
        </TabPane>
        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              Purchase Management
            </span>
          }
          key="purchase"
        >
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h3>Purchase Management</h3>
            <p>Purchase management features coming soon...</p>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SalesTabs;
