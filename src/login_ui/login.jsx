
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail } from '../utils';
import { Form, Input, Button, Select, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, TeamOutlined } from '@ant-design/icons';
import './login.css';

const { Option } = Select;
const { TabPane } = Tabs;

const Login = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        message.error(error.message);
      } else {
        message.success('Login successful');
        navigate('/profile');
        if (onClose) onClose();
      }
    } catch (error) {
      message.error('Login failed');
    }
    setLoading(false);
  };

  const handleSignUp = async (values) => {
    setLoading(true);
    try {
      const { error } = await signUp(values.email, values.password, {
        userType: values.userType,
        name: values.name,
      });
      
      if (error) {
        message.error(error.message);
      } else {
        message.success('Registration successful! Please check your email to confirm your account.');
        setActiveTab('login');
      }
    } catch (error) {
      message.error('Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-header">Authentication</div>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Login" key="login">
          <Form name="login_form" onFinish={handleLogin}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your Email!' },
                { validator: validateEmail },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="login-form-button"
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        
        <TabPane tab="Sign Up" key="signup">
          <Form name="signup_form" onFinish={handleSignUp}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input your Name!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Full Name" />
            </Form.Item>
            <Form.Item
              name="userType"
              rules={[{ required: true, message: 'Please select user type!' }]}
            >
              <Select prefix={<TeamOutlined />} placeholder="Select User Type">
                <Option value="user">User</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your Email!' },
                { validator: validateEmail },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your Password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="login-form-button"
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Login;
