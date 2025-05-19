
import React, { useState } from 'react'
import { Layout, Menu, Button, Row, Col } from 'antd'
import { useNavigate, Routes, Route } from 'react-router-dom'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CarryOutOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import SalesTabs from '../salesAndPurchase/tabs'

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
    <Layout className="dashboard-layout">
      <Header className="dashboard-header">
        <div className="header-title">YESPEE</div>
      </Header>
      <Layout className="main-content-layout">
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed}
          breakpoint="lg"
          collapsedWidth={80}
          className="dashboard-sider"
        >
          <Button
            type="primary"
            onClick={toggleCollapsed}
            className="collapse-button"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['/profile/sales-purchase']}
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

        <Content className="dashboard-content">
          <Routes>
            <Route path="/sales-purchase/*" element={<SalesTabs />} />
            {/* <Route path="settings" element={<Settings />} />
            <Route path="user" element={<User />} />
            <Route path="logout" element={<Logout />} /> */}
          </Routes>
        </Content>
      </Layout>

      <Footer className="dashboard-footer">
        <Row gutter={16}>
          <Col xs={24} sm={12}>YES PEE © 2024</Col>
          <Col xs={24} sm={12} className="footer-copyright">Copyright @ Lumin AI systems</Col>
        </Row>
      </Footer>
    </Layout>
  )
}

export default UserDashboard
