import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser  } from '../store/slices/loginSlice';
import {validateEmail} from '../utils'
import axios from 'axios';
import { Form, Input, Button, Select, message } from 'antd';
import { UserOutlined, LockOutlined, TeamOutlined } from '@ant-design/icons';
import './login.css';  // Import your CSS file here

const { Option } = Select;

const Login = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // const response = await axios.post('http://localhost:5000/api/login', {
      //   email: values.email,
      //   password: values.password,
      //   userType: values.userType,
      // });
      const response = dispatch(loginUser(values));
      console.log('Login Success:', values, response);
      navigate('/profile'); 
      message.success('Login successful');
      if (onClose) {
        onClose();
      }
    } catch (error) {
      //dispatch(loginFailure());
      message.error('Login failed');
    }
    setLoading(false);
  };

  

  return (
    <div className="login-container">
      <div className="login-header">Login</div>
      <Form
        name="login_form"
        onFinish={handleSubmit}
      >
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
            { required: true, message: 'Please input your Email!'},
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
    </div>
  );
};

export default Login;



