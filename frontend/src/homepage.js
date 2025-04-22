import React, { useState } from 'react'
import { Layout, Menu, Button,Row, Col  } from 'antd'
import { useNavigate, Routes, Route} from 'react-router-dom'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CarryOutOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import SalesTabs from '../salesAndPurchase/tabs'
// import Settings from './Settings';
// import User from './User';
// import Logout from './Logout';

const { Header, Content, Footer, Sider } = Layout

const UserDashboard = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const handleMenuClick = ({ key }) => {
    navigate(key)
  }

  return (
    <Layout style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <Header>
        <div className="header-title">YESPEE</div>
      </Header>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Button
            type="primary"
            onClick={toggleCollapsed}
            style={{
              marginBottom: 16,
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['/profile/sales-purchase']}
            inlineCollapsed={collapsed}
            onClick={handleMenuClick}
            items={[
              {
                key: '/profile/sales-purchase',
                icon: <CarryOutOutlined />,
                label: 'Sales & Purchase',
              },
              {
                key: '/profile/settings',
                icon: <SettingOutlined />,
                label: 'Settings',
              },
              {
                key: '/profile/user',
                icon: <UserOutlined />,
                label: 'User',
              },
              {
                key: '/',
                icon: <LogoutOutlined />,
                label: 'Logout',
              },
            ]}
          />
        </Sider>

        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <Routes>
            <Route path="/sales-purchase/*" element={<SalesTabs />} />
            {/* <Route path="settings" element={<Settings />} />
            <Route path="user" element={<User />} />
            <Route path="logout" element={<Logout />} /> */}
          </Routes>
        </Content>
      </Layout>

      <Footer className="footer">
        <Row gutter={16}>
          <Col span={12}>YES PEE © 2024</Col>
          <Col span={12}>Copyright @ Lumin AI systems</Col>
        </Row>
      </Footer>
    </Layout>
  )
}

export default UserDashboard
