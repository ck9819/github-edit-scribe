
import React, { useState } from 'react';
import { Button, Modal, Layout, Row, Col, Card, Typography } from 'antd';
import { BarChartOutlined, ShoppingCartOutlined, DatabaseOutlined, TruckOutlined } from '@ant-design/icons';
import Login from './login';
import './login.css';
import { supplierDetails } from '../constants';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const features = [
    {
      icon: <DatabaseOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      title: 'Inventory Tracking',
      description: 'Real-time tracking of stock levels and inventory movements'
    },
    {
      icon: <ShoppingCartOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      title: 'Sales Management',
      description: 'Streamline your sales process from enquiry to delivery'
    },
    {
      icon: <TruckOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />,
      title: 'Purchase Orders',
      description: 'Efficient purchase order management and supplier tracking'
    },
    {
      icon: <BarChartOutlined style={{ fontSize: '32px', color: '#eb2f96' }} />,
      title: 'Analytics',
      description: 'Comprehensive reports and analytics for better decisions'
    }
  ];

  return (
    <Layout className="landing-layout">
      <Header className="responsive-header">
        <div className="header-content">
          <div className="header-title">{supplierDetails.name}</div>
          <Button type="primary" className='login-button' onClick={showModal}>
            Get Started
          </Button>
        </div>
      </Header>
      
      <Content className="landing-content">
        <div className="hero-section">
          <div className="hero-content">
            <Title level={1} className="hero-title">
              Welcome to {supplierDetails.name}
            </Title>
            <Paragraph className="hero-description">
              Streamline your business operations with our comprehensive inventory and sales management solution. 
              Track inventory, manage sales, and grow your business efficiently.
            </Paragraph>
            <div className="hero-buttons">
              <Button type="primary" size="large" onClick={showModal}>
                Start Managing Inventory
              </Button>
            </div>
          </div>
          
          <div className="hero-image">
            <div className="inventory-illustration">
              <DatabaseOutlined style={{ fontSize: '120px', color: '#1890ff', opacity: 0.8 }} />
            </div>
          </div>
        </div>

        <div className="features-section">
          <Title level={2} className="features-title">
            Powerful Features for Your Business
          </Title>
          <Row gutter={[32, 32]} className="features-grid">
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="feature-card" hoverable>
                  <div className="feature-icon">{feature.icon}</div>
                  <Title level={4}>{feature.title}</Title>
                  <Paragraph>{feature.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>

      <Modal
        title="Welcome to Inventory Management System"
        open={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        centered
        width={500}
      >
        <Login onClose={handleCancel} />
      </Modal>

      <Footer className='landing-footer'>
        <Row gutter={16}>
          <Col xs={24} sm={12}>{supplierDetails.name} © 2024</Col>
          <Col xs={24} sm={12} className="copyright-text">Powered by Advanced Technology Solutions</Col>
        </Row>
      </Footer>
    </Layout>
  );
};

export default App;
