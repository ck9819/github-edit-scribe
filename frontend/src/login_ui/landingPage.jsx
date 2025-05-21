
import React, { useState } from 'react';
import { Button, Modal, Layout, Image, Row, Col } from 'antd';
import Login from './login';
import './login.css';
import { supplierDetails } from '../constants';

const { Header, Content, Footer } = Layout;

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout className="landing-layout">
      <Header className="responsive-header">
        <div className="header-content">
          <div className="header-title">{supplierDetails.name}</div>
          <Button type="link" className='login-button' onClick={showModal}>
            Login
          </Button>
        </div>
      </Header>
      <Content className="landing-content">
        <div className="content-container">
          <h1 className="welcome-title">Welcome to {supplierDetails.name}</h1>
          <p className="welcome-description">Your Enterprise Solution for Purchase and Expense Efficiency</p>
        </div>
      </Content>
      <Modal
        title="Login"
        open={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        centered
      >
        <Login onClose={handleCancel} />
      </Modal>
      <Footer className='landing-footer'>
        <Row gutter={16}>
          <Col xs={24} sm={12}>{supplierDetails.name} © 2024</Col>
          <Col xs={24} sm={12} className="copyright-text">Copyright @ Lumin AI systems</Col>
        </Row>
      </Footer>
    </Layout>
  );
};

export default App;
