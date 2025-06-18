import React from 'react';
import { Tabs } from 'antd';
import { InboxOutlined, HomeOutlined, TagsOutlined, AppstoreOutlined, ExperimentOutlined, BellOutlined } from '@ant-design/icons';
import ItemsList from './ItemsList';
import WarehousesList from './WarehousesList';
import BatchManagement from './BatchManagement';
import SmartReorderSystem from './SmartReorderSystem';

const { TabPane } = Tabs;

const InventoryManagement = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Tabs defaultActiveKey="items" type="card">
        <TabPane
          tab={
            <span>
              <InboxOutlined />
              Items/Products
            </span>
          }
          key="items"
        >
          <ItemsList />
        </TabPane>
        <TabPane
          tab={
            <span>
              <HomeOutlined />
              Warehouses
            </span>
          }
          key="warehouses"
        >
          <WarehousesList />
        </TabPane>
        <TabPane
          tab={
            <span>
              <ExperimentOutlined />
              Batch & Expiry
            </span>
          }
          key="batches"
        >
          <BatchManagement />
        </TabPane>
        <TabPane
          tab={
            <span>
              <BellOutlined />
              Smart Reorder
            </span>
          }
          key="reorder"
        >
          <SmartReorderSystem />
        </TabPane>
        <TabPane
          tab={
            <span>
              <TagsOutlined />
              Categories
            </span>
          }
          key="categories"
        >
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h3>Categories Management</h3>
            <p>Categories management features coming soon...</p>
          </div>
        </TabPane>
        <TabPane
          tab={
            <span>
              <AppstoreOutlined />
              Brands
            </span>
          }
          key="brands"
        >
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h3>Brands Management</h3>
            <p>Brands management features coming soon...</p>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default InventoryManagement;