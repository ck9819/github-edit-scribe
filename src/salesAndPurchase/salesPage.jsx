
import React, { useState } from 'react';
import { Tabs } from 'antd';
import SalesEnquiryForm from './salesEnquiryForm';
import SalesEnquiryList from './salesEnquiryList';

const { TabPane } = Tabs;

const SalesPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="Create Sales Enquiry" key="1">
          <SalesEnquiryForm />
        </TabPane>
        <TabPane tab="Sales Enquiries List" key="2">
          <SalesEnquiryList />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SalesPage;
