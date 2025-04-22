import React, { useState } from 'react';
import { Button, Modal, Layout, Image } from 'antd';
import Login from './login';
import landingPageImg from './static/assets/background.jpeg';
import './App.css';  // Import your CSS file here

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
      <Header>
        <div className="header-title">YESPEE</div>
        <Button className='login-button'   onClick={showModal}>
          Login
        </Button>
      </Header>
      <Content>
        <Image className='image' />
      </Content>
      <Modal
        title="Login"
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <Login onClose={handleCancel} />
      </Modal>
      <Footer className='footer'>
        YES PEE © 2024
      </Footer>
    </div>
  );
};

export default App;