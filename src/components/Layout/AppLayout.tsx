
import React, { useState } from 'react';
import { Layout, Menu, Button, Badge, Avatar, Dropdown } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom';
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
  BarChartOutlined,
  TeamOutlined,
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
      key: '/profile/dashboard',
      icon: <AppstoreOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'inventory',
      icon: <InboxOutlined />,
      label: 'Inventory',
      children: [
        {
          key: '/profile/inventory/items',
          label: 'Items/Products',
        },
        {
          key: '/profile/inventory/categories',
          label: 'Categories',
        },
        {
          key: '/profile/inventory/brands',
          label: 'Brands',
        },
        {
          key: '/profile/inventory/warehouses',
          label: 'Warehouses',
        },
        {
          key: '/profile/inventory/stock-transactions',
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
          key: '/profile/purchase/suppliers',
          label: 'Suppliers',
        },
        {
          key: '/profile/purchase/orders',
          label: 'Purchase Orders',
        },
        {
          key: '/profile/purchase/receipts',
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
          key: '/profile/sales/customers',
          label: 'Customers',
        },
        {
          key: '/profile/sales/orders',
          label: 'Sales Orders',
        },
        {
          key: '/profile/sales/invoices',
          label: 'Invoices',
        },
      ],
    },
    {
      key: 'reports',
      icon: <BarChartOutlined />,
      label: 'Reports',
      children: [
        {
          key: '/profile/reports/inventory',
          label: 'Inventory Reports',
        },
        {
          key: '/profile/reports/sales',
          label: 'Sales Reports',
        },
        {
          key: '/profile/reports/purchase',
          label: 'Purchase Reports',
        },
      ],
    },
    {
      key: 'admin',
      icon: <TeamOutlined />,
      label: 'Administration',
      children: [
        {
          key: '/profile/admin/users',
          label: 'User Roles',
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
