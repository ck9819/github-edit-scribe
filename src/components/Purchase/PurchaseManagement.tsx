
import React from 'react';
import { Tabs } from 'antd';
import { ShoppingCartOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import PurchaseOrdersList from './PurchaseOrdersList';
import SuppliersList from './SuppliersList';
import GoodsReceiptsList from './GoodsReceiptsList';

const { TabPane } = Tabs;

const PurchaseManagement = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Tabs defaultActiveKey="orders" type="card">
        <TabPane
          tab={
            <span>
              <ShoppingCartOutlined />
              Purchase Orders
            </span>
          }
          key="orders"
        >
          <PurchaseOrdersList />
        </TabPane>
        <TabPane
          tab={
            <span>
              <UserOutlined />
              Suppliers
            </span>
          }
          key="suppliers"
        >
          <SuppliersList />
        </TabPane>
        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              Goods Receipts
            </span>
          }
          key="receipts"
        >
          <GoodsReceiptsList />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PurchaseManagement;
