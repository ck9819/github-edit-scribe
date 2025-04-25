import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'antd';
import { logoutUser } from '../features/authSlice';

const LogoutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <Button type="primary" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
