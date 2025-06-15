
import React from 'react';
import { Tabs } from 'antd';
import { FileTextOutlined, ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons';
import SalesOrdersList from './SalesOrdersList';
import CustomersList from './CustomersList';
import SalesQuotationsList from './SalesQuotationsList';

const { TabPane } = Tabs;

const SalesManagement = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Tabs defaultActiveKey="quotations" type="card">
        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              Quotations
            </span>
          }
          key="quotations"
        >
          <SalesQuotationsList />
        </TabPane>
        <TabPane
          tab={
            <span>
              <ShoppingCartOutlined />
              Sales Orders
            </span>
          }
          key="orders"
        >
          <SalesOrdersList />
        </TabPane>
        <TabPane
          tab={
            <span>
              <DollarOutlined />
              Customers
            </span>
          }
          key="customers"
        >
          <CustomersList />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SalesManagement;
