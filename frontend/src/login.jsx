import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from './store';
import axios from 'axios';
import { Form, Input, Button, Select, message } from 'antd';
import { UserOutlined, LockOutlined, TeamOutlined } from '@ant-design/icons';
import './App.css';  // Import your CSS file here

const { Option } = Select;

const Login = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email: values.email,
        password: values.password,
        userType: values.userType,
      });
      dispatch(loginSuccess(response.data.token));
      console.log('Login Success:', values, response.data.token);
      navigate('/profile'); 
      message.success('Login successful');
      if (onClose) {
        onClose();
      }
    } catch (error) {
      dispatch(loginFailure());
      message.error('Login failed');
    }
    setLoading(false);
  };

  const validateEmail = (_, value) => {
    if (value && value.split('@').length !== 2) {
      return Promise.reject(new Error('Email should contain only one "@" symbol'));
    }
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return Promise.reject(new Error('Please enter a valid email address'));
    }
    return Promise.resolve();
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



// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { loginSuccess, loginFailure } from './store';
// import axios from 'axios';
// import { Form, Input, Button, Select, message } from 'antd';
// import { UserOutlined, LockOutlined, TeamOutlined } from '@ant-design/icons';
// //import { useHistory } from 'react-router-dom';

// const { Option } = Select;

// const Login = ({ onClose }) => {
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleSubmit = async (values) => {
//     setLoading(true);
//     try {
//       const response = await axios.post('http://localhost:5000/api/login', {
//         email: values.email,
//         password: values.password,
//         userType: values.userType,
//       });
//       dispatch(loginSuccess(response.data.token));
//       console.log('Login Success:', values, response.data.token);
//       navigate('/profile'); 
//       message.success('Login successful');
//       if (onClose) {
//         onClose();
//       }
//     } catch (error) {
//       dispatch(loginFailure());
//       message.error('Login failed');
//     }
//     setLoading(false);
//   };

//   const validateEmail = (_, value) => {
//     if (value && value.split('@').length !== 2) {
//       return Promise.reject(new Error('Email should contain only one "@" symbol'));
//     }
//     if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
//       return Promise.reject(new Error('Please enter a valid email address'));
//     }
//     return Promise.resolve();
//   };

//   return (
//     <div style={{ width: '100%' }}>
//       <Form
//         name="login_form"
//         onFinish={handleSubmit}
//         //initialValues={{ userType: 'user' }}
//       >
//         <Form.Item name="userType" 
//         rules={[{ required: true, message: 'Please select user type!' }]}>
//           <Select prefix={<TeamOutlined />} placeholder="Select User Type">
//             <Option value="user">User</Option>
//             <Option value="admin">Admin</Option>
//           </Select>
//         </Form.Item>
//         <Form.Item
//           name="email"
//           rules={[
//             { required: true, message: 'Please input your Email!'}, { validator: validateEmail }]}
//         >
//           <Input prefix={<UserOutlined />} placeholder="Email" />
//         </Form.Item>
//         <Form.Item
//           name="password"
//           rules={[{ required: true, message: 'Please input your Password!' }]}
//         >
//           <Input.Password prefix={<LockOutlined />} placeholder="Password" />
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit" loading={loading} block>
//             Login
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default Login;