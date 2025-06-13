import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Typography, Alert, Space, Button, Statistic } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import DashboardCards from './DashboardCards';
import { EyeOutlined, PlusOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

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
        .limit(8);

      if (error) throw error;
      return data;
    },
  });

  const transactionColumns = [
    {
      title: 'Item',
      dataIndex: ['itemmaster', 'itemname'],
      key: 'itemname',
      ellipsis: true,
    },
    {
      title: 'Type',
      dataIndex: 'transaction_type',
      key: 'transaction_type',
      render: (type) => (
        <Space>
          {type === 'IN' ? (
            <ArrowUpOutlined style={{ color: '#52c41a' }} />
          ) : type === 'OUT' ? (
            <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
          ) : (
            <ArrowUpOutlined style={{ color: '#faad14' }} />
          )}
          <span style={{ 
            color: type === 'IN' ? '#52c41a' : type === 'OUT' ? '#ff4d4f' : '#faad14',
            fontWeight: '600',
            fontSize: '12px'
          }}>
            {type}
          </span>
        </Space>
      ),
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      render: (qty) => (
        <Text strong style={{ fontSize: '12px' }}>{qty}</Text>
      )
    },
    {
      title: 'Reference',
      dataIndex: 'reference_type',
      key: 'reference_type',
      width: 100,
      render: (ref) => (
        <Text style={{ fontSize: '11px', color: '#8c8c8c' }}>{ref}</Text>
      )
    },
    {
      title: 'Date',
      dataIndex: 'transaction_date',
      key: 'transaction_date',
      width: 100,
      render: (date) => (
        <Text style={{ fontSize: '11px' }}>
          {new Date(date).toLocaleDateString()}
        </Text>
      ),
    },
  ];

  useEffect(() => {
    if (dashboardData) {
      setStats(dashboardData);
    }
  }, [dashboardData]);

  return (
    <div style={{ padding: '0', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '32px 0',
        marginBottom: '24px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <Title level={1} style={{ 
            color: '#fff', 
            margin: '0 0 8px 0',
            fontSize: '2.5rem',
            fontWeight: '700'
          }}>
            Dashboard Overview
          </Title>
          <Text style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontSize: '16px' 
          }}>
            Welcome back! Here's what's happening with your business today.
          </Text>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        {stats.lowStockItems > 0 && (
          <Alert
            message={`⚠️ Attention Required: ${stats.lowStockItems} items are running low on stock!`}
            description="These items need immediate reordering to avoid stockouts. Click here to view and take action."
            type="warning"
            showIcon
            action={
              <Button size="small" type="primary" ghost>
                View Items
              </Button>
            }
            style={{ 
              marginBottom: '24px',
              borderRadius: '12px',
              border: '1px solid #faad14'
            }}
          />
        )}

        <DashboardCards stats={stats} />

        <Row gutter={[24, 24]} style={{ marginTop: '32px' }}>
          <Col xs={24} lg={14}>
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '18px', fontWeight: '600' }}>Recent Stock Movements</span>
                  <Button 
                    type="text" 
                    icon={<EyeOutlined />} 
                    size="small"
                    onClick={() => navigate('/profile/inventory/items')}
                  >
                    View All
                  </Button>
                </div>
              }
              loading={isLoading}
              style={{
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}
              bordered={false}
            >
              <Table
                dataSource={recentTransactions}
                columns={transactionColumns}
                pagination={false}
                rowKey="id"
                size="small"
                style={{ fontSize: '12px' }}
                scroll={{ x: true }}
              />
            </Card>
          </Col>
          
          <Col xs={24} lg={10}>
            <Row gutter={[0, 24]}>
              <Col span={24}>
                <Card 
                  title="Quick Actions"
                  style={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                  }}
                  bordered={false}
                >
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      block 
                      size="large"
                      style={{ borderRadius: '8px', height: '48px', fontSize: '15px', fontWeight: '600' }}
                      onClick={() => navigate('/profile/inventory/items')}
                    >
                      Add New Item
                    </Button>
                    <Button 
                      icon={<PlusOutlined />} 
                      block 
                      size="large"
                      style={{ borderRadius: '8px', height: '48px', fontSize: '15px' }}
                      onClick={() => navigate('/profile/purchase/orders')}
                    >
                      Create Purchase Order
                    </Button>
                    <Button 
                      icon={<PlusOutlined />} 
                      block 
                      size="large"
                      style={{ borderRadius: '8px', height: '48px', fontSize: '15px' }}
                      onClick={() => navigate('/profile/sales/orders')}
                    >
                      New Sales Order
                    </Button>
                  </Space>
                </Card>
              </Col>
              
              <Col span={24}>
                <Card 
                  title="Performance Metrics"
                  style={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                  }}
                  bordered={false}
                >
                  <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <div>
                      <Statistic
                        title="Inventory Turnover"
                        value={8.2}
                        precision={1}
                        suffix="x"
                        valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: '700' }}
                      />
                      <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>+15% from last quarter</Text>
                    </div>
                    <div>
                      <Statistic
                        title="Order Fulfillment Rate"
                        value={96.8}
                        precision={1}
                        suffix="%"
                        valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: '700' }}
                      />
                      <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>Above industry average</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
