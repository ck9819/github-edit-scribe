
// SalesPurchase.js
import React, { useState } from 'react'
import { Tabs, Layout } from 'antd'
import SalesPage from './salesPage.jsx'
import QuotationsPage from './quotationPage.jsx'
import './sales.css';  // Import your CSS file here

const { TabPane } = Tabs;
const { Content } = Layout;

const SalesTabs = () => {
  return (
    <Layout className="sales-layout">
      <Content className="sales-content">
        <Tabs
          defaultActiveKey="1"
          type="card"
          className="sales-tabs"
        >
          <TabPane tab="Sales & Purchase" key="1">
            <SalesPage />
          </TabPane>
          <TabPane tab="Quotations" key="2">
            <QuotationsPage />
          </TabPane>
          <TabPane tab="All Documents" key="3">
            <QuotationsPage />
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  )
}

export default SalesTabs
