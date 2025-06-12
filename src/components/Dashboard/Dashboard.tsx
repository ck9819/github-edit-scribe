
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Typography, Alert } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';
import DashboardCards from './DashboardCards';

const { Title } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState({});

  // Fetch dashboard statistics
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Get total items
      const { count: totalItems } = await supabase
        .from('itemmaster')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get low stock items
      const { count: lowStockItems } = await supabase
        .from('itemmaster')
        .select('*', { count: 'exact', head: true })
        .lte('currentstock', 'reorder_level')
        .eq('is_active', true);

      // Get total customers
      const { count: totalCustomers } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get pending purchase orders
      const { count: pendingOrders } = await supabase
        .from('purchase_orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PENDING');

      return {
        totalItems: totalItems || 0,
        lowStockItems: lowStockItems || 0,
        totalCustomers: totalCustomers || 0,
        pendingOrders: pendingOrders || 0,
      };
    },
  });

  // Fetch recent transactions
  const { data: recentTransactions } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stock_transactions')
        .select(`
          id,
          transaction_type,
          quantity,
          transaction_date,
          reference_type,
          itemmaster (itemname)
        `)
        .order('transaction_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  const transactionColumns = [
    {
      title: 'Item',
      dataIndex: ['itemmaster', 'itemname'],
      key: 'itemname',
    },
    {
      title: 'Type',
      dataIndex: 'transaction_type',
      key: 'transaction_type',
      render: (type) => (
        <span style={{ 
          color: type === 'IN' ? '#52c41a' : type === 'OUT' ? '#ff4d4f' : '#faad14' 
        }}>
          {type}
        </span>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Reference',
      dataIndex: 'reference_type',
      key: 'reference_type',
    },
    {
      title: 'Date',
      dataIndex: 'transaction_date',
      key: 'transaction_date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  useEffect(() => {
    if (dashboardData) {
      setStats(dashboardData);
    }
  }, [dashboardData]);

  return (
    <div style={{ padding: '0' }}>
      <Title level={2}>Dashboard</Title>
      
      {stats.lowStockItems > 0 && (
        <Alert
          message={`You have ${stats.lowStockItems} items with low stock!`}
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      <DashboardCards stats={stats} />

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="Recent Stock Transactions" loading={isLoading}>
            <Table
              dataSource={recentTransactions}
              columns={transactionColumns}
              pagination={false}
              rowKey="id"
              size="small"
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Quick Actions">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="/inventory/items">Manage Items</a>
              <a href="/purchase/orders">Create Purchase Order</a>
              <a href="/sales/orders">Create Sales Order</a>
              <a href="/reports/inventory">View Inventory Report</a>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
