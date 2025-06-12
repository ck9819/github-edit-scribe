
import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Select, message, Card, Transfer } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import { supabase } from '../../integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const { Option } = Select;

const UserRolesList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: userRoles = [], isLoading } = useSupabaseQuery('user_roles', 'user_roles');
  const { data: userProfiles = [] } = useSupabaseQuery('user_profiles', 'user_profiles');

  const rolePermissions = {
    ADMIN: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE_USERS', 'VIEW_REPORTS'],
    INVENTORY_MANAGER: ['CREATE', 'READ', 'UPDATE', 'MANAGE_INVENTORY', 'VIEW_REPORTS'],
    SALES_PERSON: ['CREATE', 'READ', 'UPDATE', 'MANAGE_SALES'],
    PURCHASE_MANAGER: ['CREATE', 'READ', 'UPDATE', 'MANAGE_PURCHASES', 'VIEW_REPORTS'],
  };

  const handleSaveRole = async (values) => {
    try {
      const roleData = {
        user_id: values.user_id,
        role: values.role,
        permissions: { permissions: rolePermissions[values.role] }
      };

      if (editingRole) {
        await supabase
          .from('user_roles')
          .update(roleData)
          .eq('id', editingRole.id);
        message.success('User role updated successfully');
      } else {
        await supabase
          .from('user_roles')
          .insert([roleData]);
        message.success('User role created successfully');
      }

      queryClient.invalidateQueries({ queryKey: ['user_roles'] });
      setIsModalVisible(false);
      setEditingRole(null);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save user role');
    }
  };

  const handleDeleteRole = async (roleId) => {
    try {
      await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);
      
      message.success('User role deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['user_roles'] });
    } catch (error) {
      message.error('Failed to delete user role');
    }
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'user_id',
      key: 'user_id',
      render: (user_id) => {
        const user = userProfiles.find(u => u.id === user_id);
        return user?.name || user?.username || 'Unknown User';
      },
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const colors = {
          ADMIN: 'red',
          INVENTORY_MANAGER: 'blue',
          SALES_PERSON: 'green',
          PURCHASE_MANAGER: 'orange',
        };
        return <Tag color={colors[role]}>{role.replace('_', ' ')}</Tag>;
      },
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => {
        const perms = permissions?.permissions || [];
        return (
          <div>
            {perms.slice(0, 3).map(perm => (
              <Tag key={perm} size="small">{perm}</Tag>
            ))}
            {perms.length > 3 && <Tag size="small">+{perms.length - 3} more</Tag>}
          </div>
        );
      },
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingRole(record);
              form.setFieldsValue({
                user_id: record.user_id,
                role: record.role,
              });
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRole(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Card>
          <h3>Role Permissions Overview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
            {Object.entries(rolePermissions).map(([role, permissions]) => (
              <div key={role} style={{ padding: 16, border: '1px solid #d9d9d9', borderRadius: 8 }}>
                <Tag color="blue" style={{ marginBottom: 8 }}>{role.replace('_', ' ')}</Tag>
                <div>
                  {permissions.map(perm => (
                    <Tag key={perm} size="small" style={{ marginBottom: 4 }}>{perm}</Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>User Roles Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingRole(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Assign Role
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={userRoles}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingRole ? 'Edit User Role' : 'Assign User Role'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingRole(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          onFinish={handleSaveRole}
          layout="vertical"
        >
          <Form.Item
            name="user_id"
            label="User"
            rules={[{ required: true, message: 'Please select user' }]}
          >
            <Select placeholder="Select User">
              {userProfiles.map(user => (
                <Option key={user.id} value={user.id}>
                  {user.name || user.username} ({user.username})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select placeholder="Select Role">
              <Option value="ADMIN">Admin</Option>
              <Option value="INVENTORY_MANAGER">Inventory Manager</Option>
              <Option value="SALES_PERSON">Sales Person</Option>
              <Option value="PURCHASE_MANAGER">Purchase Manager</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingRole ? 'Update Role' : 'Assign Role'}
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserRolesList;
