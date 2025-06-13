
import React, { useEffect, useState } from 'react';
import { Form, Select, Button, Row, Col, message, Checkbox, Card } from 'antd';
import { useSupabaseInsert, useSupabaseUpdate } from '../../hooks/useSupabaseQuery';

const { Option } = Select;

const UserRoleForm = ({ userRole, userProfiles, onSuccess }) => {
  const [form] = Form.useForm();
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const insertUserRoleMutation = useSupabaseInsert('user_roles', 'user_roles');
  const updateUserRoleMutation = useSupabaseUpdate('user_roles', 'user_roles');

  const availablePermissions = {
    'inventory.read': 'View Inventory',
    'inventory.write': 'Manage Inventory',
    'sales.read': 'View Sales',
    'sales.write': 'Manage Sales',
    'purchase.read': 'View Purchases',
    'purchase.write': 'Manage Purchases',
    'reports.read': 'View Reports',
    'admin.users': 'Manage Users',
    'admin.settings': 'Manage Settings',
  };

  useEffect(() => {
    if (userRole) {
      form.setFieldsValue({
        user_id: userRole.user_id,
        role: userRole.role,
      });
      setSelectedPermissions(userRole.permissions || {});
    } else {
      form.resetFields();
      setSelectedPermissions({});
    }
  }, [userRole, form]);

  const handlePermissionChange = (permission, checked) => {
    setSelectedPermissions(prev => ({
      ...prev,
      [permission]: checked
    }));
  };

  const handleSubmit = async (values) => {
    try {
      const roleData = {
        ...values,
        permissions: selectedPermissions,
      };

      if (userRole) {
        await updateUserRoleMutation.mutateAsync({ id: userRole.id, updates: roleData });
        message.success('User role updated successfully');
      } else {
        await insertUserRoleMutation.mutateAsync(roleData);
        message.success('User role assigned successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('User role operation error:', error);
      message.error(userRole ? 'Failed to update user role' : 'Failed to assign user role');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        role: 'user',
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="user_id"
            label="Select User"
            rules={[{ required: true, message: 'Please select a user' }]}
          >
            <Select placeholder="Select user">
              {userProfiles?.map(profile => (
                <Option key={profile.id} value={profile.id}>
                  {profile.name || profile.username}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        
        <Col span={12}>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select>
              <Option value="user">User</Option>
              <Option value="moderator">Moderator</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Permissions">
        <Card size="small">
          <Row gutter={[16, 8]}>
            {Object.entries(availablePermissions).map(([key, label]) => (
              <Col span={12} key={key}>
                <Checkbox
                  checked={selectedPermissions[key] || false}
                  onChange={(e) => handlePermissionChange(key, e.target.checked)}
                >
                  {label}
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Card>
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={insertUserRoleMutation.isPending || updateUserRoleMutation.isPending}
        >
          {userRole ? 'Update Role' : 'Assign Role'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserRoleForm;
