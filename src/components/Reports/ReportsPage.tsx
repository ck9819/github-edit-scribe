import React, { useState } from 'react';
import { Tabs } from 'antd';
import { BarChartOutlined, LineChartOutlined, PieChartOutlined, FileTextOutlined } from '@ant-design/icons';
import AdvancedReports from './AdvancedReports';

const { TabPane } = Tabs;

const ReportsPage = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Tabs defaultActiveKey="advanced" type="card">
        <TabPane
          tab={
            <span>
              <BarChartOutlined />
              Advanced Analytics
            </span>
          }
          key="advanced"
        >
          <AdvancedReports />
        </TabPane>
        <TabPane
          tab={
            <span>
              <LineChartOutlined />
              Sales Reports
            </span>
          }
          key="sales"
        >
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h3>Sales Reports</h3>
            <p>Detailed sales reporting features coming soon...</p>
          </div>
        </TabPane>
        <TabPane
          tab={
            <span>
              <PieChartOutlined />
              Inventory Reports
            </span>
          }
          key="inventory"
        >
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h3>Inventory Reports</h3>
            <p>Detailed inventory reporting features coming soon...</p>
          </div>
        </TabPane>
        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              Financial Reports
            </span>
          }
          key="financial"
        >
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h3>Financial Reports</h3>
            <p>Financial reporting features coming soon...</p>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ReportsPage;