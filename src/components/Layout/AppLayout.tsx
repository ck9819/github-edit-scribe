
import React, { useState } from 'react';
import { Layout, Menu, Button, Badge, Avatar, Dropdown, Space } from 'antd';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
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
  DatabaseOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { supplierDetails } from '../../constants';

const { Header, Content, Footer, Sider } = Layout;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
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
      <Header 
        className="header" 
        style={{ 
          padding: 0, 
          background: 'linear-gradient(135deg, #001529, #1c3a5c)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          height: '100%', 
          paddingRight: '24px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ 
                fontSize: '18px', 
                width: 64, 
                height: 64, 
                color: '#fff',
                borderRadius: '0'
              }}
            />
            <Space style={{ marginLeft: '16px' }}>
              <DatabaseOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <div style={{ 
                color: '#fff', 
                fontSize: '20px', 
                fontWeight: '700',
                letterSpacing: '-0.5px'
              }}>
                {supplierDetails.name}
              </div>
            </Space>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Badge count={5} size="small">
              <Button
                type="text"
                icon={<BellOutlined style={{ fontSize: '18px', color: '#fff' }} />}
                style={{ 
                  borderRadius: '8px',
                  width: '40px',
                  height: '40px'
                }}
              />
            </Badge>
            
            <Dropdown 
              menu={{ items: userMenuItems, onClick: handleMenuClick }} 
              placement="bottomRight"
              trigger={['click']}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}>
                <Avatar 
                  icon={<UserOutlined />} 
                  style={{ 
                    background: 'linear-gradient(135deg, #1890ff, #096dd9)',
                    marginRight: '8px'
                  }}
                />
                <span style={{ fontWeight: '500' }}>
                  {user?.email?.split('@')[0] || 'User'}
                </span>
              </div>
            </Dropdown>
          </div>
        </div>
      </Header>

      <Layout>
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed} 
          breakpoint="lg" 
          collapsedWidth="0"
          style={{
            background: '#fff',
            borderRight: '1px solid #f0f0f0',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{
              borderRight: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}
          />
        </Sider>

        <Layout>
          <Content style={{ 
            margin: '0', 
            background: '#f5f5f5',
            minHeight: 280,
            overflow: 'auto'
          }}>
            <Outlet />
          </Content>
          
          <Footer style={{ 
            textAlign: 'center',
            background: '#fff',
            borderTop: '1px solid #f0f0f0',
            padding: '16px 24px',
            fontSize: '14px',
            color: '#8c8c8c'
          }}>
            {supplierDetails.name} ©2024 - Advanced Inventory Management System
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
