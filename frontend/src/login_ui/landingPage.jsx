
import React, { useState } from 'react';
import { Button, Modal, Layout, Image, Row, Col } from 'antd';
import Login from './login';
import './login.css';  // Import your CSS file here

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
    <div id="home">
      <Header className="responsive-header">
        <div className="header-content">
          <div className="header-title">YESPEE</div>
          <Button className='login-button' onClick={showModal}>
            Login
          </Button>
        </div>
      </Header>
      <Content>
        <Image className='image' />
      </Content>
      <Modal
        title="Login"
        open={isModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <Login onClose={handleCancel} />
      </Modal>
      <Footer className='footer'>
        <Row gutter={16}>
          <Col xs={24} sm={12}>YES PEE © 2024</Col>
          <Col xs={24} sm={12} className="copyright-text">Copyright @ Lumin AI systems</Col>
        </Row>
      </Footer>
    </div>
  );
};

export default App;
