
import React, { useState } from 'react';
import { Button, Modal, Layout, Row, Col, Card, Typography, Space } from 'antd';
import { BarChartOutlined, ShoppingCartOutlined, DatabaseOutlined, TruckOutlined, RocketOutlined, ShieldCheckOutlined } from '@ant-design/icons';
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
      icon: <DatabaseOutlined style={{ fontSize: '40px', color: '#1890ff' }} />,
      title: 'Smart Inventory',
      description: 'AI-powered inventory tracking with real-time stock monitoring and automated reorder alerts'
    },
    {
      icon: <ShoppingCartOutlined style={{ fontSize: '40px', color: '#52c41a' }} />,
      title: 'Sales Excellence',
      description: 'Streamlined sales process from enquiry to delivery with comprehensive order management'
    },
    {
      icon: <TruckOutlined style={{ fontSize: '40px', color: '#fa8c16' }} />,
      title: 'Purchase Control',
      description: 'Efficient purchase order management with supplier tracking and automated workflows'
    },
    {
      icon: <BarChartOutlined style={{ fontSize: '40px', color: '#eb2f96' }} />,
      title: 'Business Intelligence',
      description: 'Advanced analytics and reporting for data-driven business decisions'
    },
    {
      icon: <RocketOutlined style={{ fontSize: '40px', color: '#722ed1' }} />,
      title: 'Performance Boost',
      description: 'Increase operational efficiency by up to 40% with automated processes'
    },
    {
      icon: <ShieldCheckOutlined style={{ fontSize: '40px', color: '#13c2c2' }} />,
      title: 'Enterprise Security',
      description: 'Bank-grade security with role-based access control and audit trails'
    }
  ];

  return (
    <Layout className="landing-layout">
      <Header className="responsive-header">
        <div className="header-content">
          <div className="header-title">
            <DatabaseOutlined style={{ marginRight: '8px', fontSize: '24px' }} />
            {supplierDetails.name}
          </div>
          <Space>
            <Button type="ghost" className="login-button">
              Learn More
            </Button>
            <Button type="primary" className="cta-button" onClick={showModal}>
              Get Started Free
            </Button>
          </Space>
        </div>
      </Header>
      
      <Content className="landing-content">
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <span>🚀 Transform Your Business Operations</span>
            </div>
            <Title level={1} className="hero-title">
              Next-Generation
              <br />
              <span className="gradient-text">Inventory Management</span>
            </Title>
            <Paragraph className="hero-description">
              Revolutionize your business with our comprehensive inventory and sales management solution. 
              Experience seamless operations, real-time insights, and unprecedented growth potential.
            </Paragraph>
            <div className="hero-buttons">
              <Button type="primary" size="large" className="primary-cta" onClick={showModal}>
                Start Free Trial
              </Button>
              <Button size="large" className="secondary-cta">
                Watch Demo
              </Button>
            </div>
            <div className="trust-indicators">
              <span>Trusted by 1000+ businesses worldwide</span>
            </div>
          </div>
          
          <div className="hero-image">
            <div className="floating-cards">
              <div className="feature-float-card card-1">
                <DatabaseOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
                <span>Real-time Tracking</span>
              </div>
              <div className="feature-float-card card-2">
                <BarChartOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
                <span>Smart Analytics</span>
              </div>
              <div className="feature-float-card card-3">
                <ShoppingCartOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />
                <span>Sales Management</span>
              </div>
            </div>
          </div>
        </div>

        <div className="features-section">
          <div className="section-header">
            <Title level={2} className="section-title">
              Why Choose Our Platform?
            </Title>
            <Paragraph className="section-subtitle">
              Discover the powerful features that will transform your business operations
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]} className="features-grid">
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card className="feature-card modern-card" hoverable>
                  <div className="feature-icon-wrapper">
                    {feature.icon}
                  </div>
                  <Title level={4} className="feature-title">{feature.title}</Title>
                  <Paragraph className="feature-description">{feature.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <div className="cta-section">
          <div className="cta-content">
            <Title level={2} className="cta-title">
              Ready to Transform Your Business?
            </Title>
            <Paragraph className="cta-description">
              Join thousands of businesses that have already revolutionized their operations
            </Paragraph>
            <Button type="primary" size="large" className="final-cta" onClick={showModal}>
              Start Your Free Trial Today
            </Button>
          </div>
        </div>
      </Content>

      <Modal
        title={
          <div style={{ textAlign: 'center', padding: '20px 0 10px' }}>
            <DatabaseOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '16px', display: 'block' }} />
            <Title level={3} style={{ margin: 0, color: '#1f2937' }}>
              Welcome to the Future of Inventory Management
            </Title>
          </div>
        }
        open={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        centered
        width={600}
        className="modern-modal"
      >
        <Login onClose={handleCancel} />
      </Modal>

      <Footer className="modern-footer">
        <div className="footer-content">
          <Row gutter={[32, 16]} align="middle">
            <Col xs={24} sm={12}>
              <Space>
                <DatabaseOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                <span className="footer-brand">{supplierDetails.name} © 2024</span>
              </Space>
            </Col>
            <Col xs={24} sm={12} className="footer-right">
              <span className="footer-powered">Powered by Advanced Technology Solutions</span>
            </Col>
          </Row>
        </div>
      </Footer>
    </Layout>
  );
};

export default App;
