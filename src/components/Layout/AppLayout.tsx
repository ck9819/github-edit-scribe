
import React, { useState } from 'react';
import { Layout, Menu, Button, Badge, Avatar, Dropdown } from 'antd';
import { useNavigate, Routes, Route, Outlet } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { supplierDetails } from '../../constants';

const { Header, Content, Footer, Sider } = Layout;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      signOut();
      navigate('/');
    } else {
      navigate(key);
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  const menuItems = [
    {
      key: '/dashboard',
      icon: <AppstoreOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'inventory',
      icon: <InboxOutlined />,
      label: 'Inventory',
      children: [
        {
          key: '/inventory/items',
          label: 'Items/Products',
        },
        {
          key: '/inventory/categories',
          label: 'Categories',
        },
        {
          key: '/inventory/brands',
          label: 'Brands',
        },
        {
          key: '/inventory/warehouses',
          label: 'Warehouses',
        },
        {
          key: '/inventory/stock-transactions',
          label: 'Stock Transactions',
        },
      ],
    },
    {
      key: 'purchase',
      icon: <ShoppingCartOutlined />,
      label: 'Purchase',
      children: [
        {
          key: '/purchase/suppliers',
          label: 'Suppliers',
        },
        {
          key: '/purchase/orders',
          label: 'Purchase Orders',
        },
        {
          key: '/purchase/receipts',
          label: 'Goods Receipts',
        },
      ],
    },
    {
      key: 'sales',
      icon: <ShoppingCartOutlined />,
      label: 'Sales',
      children: [
        {
          key: '/sales/customers',
          label: 'Customers',
        },
        {
          key: '/sales/orders',
          label: 'Sales Orders',
        },
        {
          key: '/sales/invoices',
          label: 'Invoices',
        },
      ],
    },
    {
      key: 'reports',
      icon: <SettingOutlined />,
      label: 'Reports',
      children: [
        {
          key: '/reports/inventory',
          label: 'Inventory Reports',
        },
        {
          key: '/reports/sales',
          label: 'Sales Reports',
        },
        {
          key: '/reports/purchase',
          label: 'Purchase Reports',
        },
      ],
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="header" style={{ padding: 0, background: '#001529' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', paddingRight: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64, color: '#fff' }}
            />
            <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
              {supplierDetails.name}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Badge count={5}>
              <BellOutlined style={{ fontSize: '18px', color: '#fff' }} />
            </Badge>
            
            <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#fff' }}>
                <Avatar icon={<UserOutlined />} />
                <span style={{ marginLeft: '8px' }}>{user?.email || 'User'}</span>
              </div>
            </Dropdown>
          </div>
        </div>
      </Header>

      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed} breakpoint="lg" collapsedWidth="0">
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['/dashboard']}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>

        <Layout>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            <Outlet />
          </Content>
          
          <Footer style={{ textAlign: 'center' }}>
            {supplierDetails.name} ©2024 - Inventory Management System
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
