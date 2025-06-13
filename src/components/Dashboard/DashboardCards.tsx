
import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { 
  ShoppingCartOutlined, 
  InboxOutlined, 
  UserOutlined, 
  DollarOutlined,
  RiseOutlined,
  WarningOutlined
} from '@ant-design/icons';

const DashboardCards = ({ stats }) => {
  const cardData = [
    {
      title: 'Total Items',
      value: stats?.totalItems || 0,
      icon: <InboxOutlined style={{ fontSize: '28px' }} />,
      color: '#1890ff',
      bgColor: '#e6f7ff',
      trend: '+12%',
      subtitle: 'Active products'
    },
    {
      title: 'Low Stock Items',
      value: stats?.lowStockItems || 0,
      icon: <WarningOutlined style={{ fontSize: '28px' }} />,
      color: '#ff4d4f',
      bgColor: '#fff2f0',
      trend: '-8%',
      subtitle: 'Need reorder',
      urgent: stats?.lowStockItems > 0
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: <UserOutlined style={{ fontSize: '28px' }} />,
      color: '#52c41a',
      bgColor: '#f6ffed',
      trend: '+24%',
      subtitle: 'Active customers'
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: <ShoppingCartOutlined style={{ fontSize: '28px' }} />,
      color: '#faad14',
      bgColor: '#fffbe6',
      trend: '+5%',
      subtitle: 'Awaiting processing'
    },
  ];

  return (
    <Row gutter={[24, 24]}>
      {cardData.map((card, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card 
            className={`dashboard-stat-card ${card.urgent ? 'urgent-card' : ''}`}
            bordered={false}
            style={{
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: card.urgent ? '2px solid #ff4d4f' : 'none',
              background: card.urgent ? '#fff2f0' : '#fff'
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  color: '#8c8c8c', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  {card.title}
                </div>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  color: card.color,
                  lineHeight: '1',
                  marginBottom: '8px'
                }}>
                  {card.value}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#8c8c8c',
                  marginBottom: '8px'
                }}>
                  {card.subtitle}
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  fontSize: '12px',
                  color: card.trend.startsWith('+') ? '#52c41a' : '#ff4d4f',
                  fontWeight: '600'
                }}>
                  <RiseOutlined style={{ marginRight: '4px', fontSize: '12px' }} />
                  {card.trend} from last month
                </div>
              </div>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: card.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color,
                marginLeft: '16px'
              }}>
                {card.icon}
              </div>
            </div>
            
            {card.urgent && (
              <div style={{
                background: '#fff',
                borderRadius: '8px',
                padding: '8px 12px',
                border: '1px solid #ffccc7'
              }}>
                <div style={{ fontSize: '12px', color: '#ff4d4f', fontWeight: '600' }}>
                  ⚠️ Immediate attention required
                </div>
              </div>
            )}
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default DashboardCards;
