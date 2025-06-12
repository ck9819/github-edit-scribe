
import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { 
  ShoppingCartOutlined, 
  InboxOutlined, 
  UserOutlined, 
  DollarOutlined 
} from '@ant-design/icons';

const DashboardCards = ({ stats }) => {
  const cardData = [
    {
      title: 'Total Items',
      value: stats?.totalItems || 0,
      icon: <InboxOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      color: '#1890ff',
    },
    {
      title: 'Low Stock Items',
      value: stats?.lowStockItems || 0,
      icon: <InboxOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />,
      color: '#ff4d4f',
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: <UserOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      color: '#52c41a',
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: <ShoppingCartOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
      color: '#faad14',
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {cardData.map((card, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Statistic
                  title={card.title}
                  value={card.value}
                  valueStyle={{ color: card.color }}
                />
              </div>
              <div>{card.icon}</div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default DashboardCards;
