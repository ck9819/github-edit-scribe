
import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, message, Avatar, Row, Col, Typography, Divider } from 'antd';
import { UserOutlined, MailOutlined, TeamOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';

const { Option } = Select;
const { Title, Text } = Typography;

const UserProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      form.setFieldsValue({
        name: data.name,
        username: data.username,
        usertype: data.usertype,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      message.error('Failed to load profile');
    }
  };

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: values.name,
          username: values.username,
          usertype: values.usertype,
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => ({ ...prev, ...values }));
      setEditing(false);
      message.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile');
    }
    setLoading(false);
  };

  const getInitials = (name) => {
    return name
      ? name.split(' ').map(n => n[0]).join('').toUpperCase()
      : user?.email?.[0]?.toUpperCase() || 'U';
  };

  if (!user || !profile) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Text>Loading profile...</Text>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <Card>
        <Row gutter={24}>
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            <Avatar
              size={120}
              style={{
                backgroundColor: '#1890ff',
                fontSize: '48px',
                marginBottom: '16px'
              }}
              icon={<UserOutlined />}
            >
              {getInitials(profile.name)}
            </Avatar>
            <Title level={4} style={{ marginBottom: '8px' }}>
              {profile.name || 'User'}
            </Title>
            <Text type="secondary">{profile.usertype || 'User'}</Text>
          </Col>

          <Col xs={24} md={16}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <Title level={3} style={{ margin: 0 }}>Profile Information</Title>
              {!editing ? (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setEditing(false);
                    form.resetFields();
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdate}
              disabled={!editing}
            >
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your full name"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your username"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="usertype"
                label="User Type"
                rules={[{ required: true, message: 'Please select user type!' }]}
              >
                <Select placeholder="Select User Type" size="large">
                  <Option value="user">User</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>

              <Divider />

              <Form.Item label="Email Address">
                <Input
                  prefix={<MailOutlined />}
                  value={user.email}
                  disabled
                  size="large"
                />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Email cannot be changed. Contact support if needed.
                </Text>
              </Form.Item>

              {editing && (
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                    size="large"
                  >
                    Save Changes
                  </Button>
                </Form.Item>
              )}
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default UserProfile;
