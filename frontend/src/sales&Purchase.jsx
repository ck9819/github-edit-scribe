// SalesPurchase.js
import React, { useState } from 'react'
import { Tabs} from 'antd'
import SalesPage from './salesPage'
import QuotationsPage from './quotationPage'
import './App.css';  // Import your CSS file here

const { TabPane } = Tabs;

const SalesPurchase = () => {

  return (
    <>
      <Tabs
        defaultActiveKey="1"
        type="card"
        style={{
          position: 'absolute',
          top: '150px',
          //   backgroundColor: "yellow",
          width: '100vw',
          padding: '20px',
        }}
      >
        <TabPane tab="Sales & Purchase" key="1">
          <SalesPage />
        </TabPane>
        <TabPane tab="quotations" key="2">
          <QuotationsPage />
        </TabPane>
        <TabPane tab="all-documents" key="3">
          <QuotationsPage />
        </TabPane>
      </Tabs>
    </>
  )
}

export default SalesPurchase
