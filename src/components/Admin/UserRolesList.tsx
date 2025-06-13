
import React, { useState } from 'react';
import { Table, Button, Space, Tag, Select, message, Modal, Card, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { useSupabaseQuery, useSupabaseDelete } from '../../hooks/useSupabaseQuery';
import UserRoleForm from './UserRoleForm';

const { Option } = Select;

const UserRolesList = () => {
  const [filterRole, setFilterRole] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUserRole, setEditingUserRole] = useState(null);

  const { data: userRoles, isLoading, refetch } = useSupabaseQuery('user_roles', 'user_roles');
  const { data: userProfiles } = useSupabaseQuery('user_profiles', 'user_profiles');
  const deleteUserRoleMutation = useSupabaseDelete('user_roles', 'user_roles');

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user role?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteUserRoleMutation.mutateAsync(id);
          message.success('User role deleted successfully');
        } catch (error) {
          message.error('Failed to delete user role');
        }
      },
    });
  };

  const getUserName = (userId) => {
    const profile = userProfiles?.find(p => p.id === userId);
    return profile?.name || profile?.username || 'Unknown User';
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'user_id',
      key: 'user_id',
      render: (userId) => getUserName(userId),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : role === 'moderator' ? 'orange' : 'blue'}>
          {role?.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Moderator', value: 'moderator' },
        { text: 'User', value: 'user' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => {
        if (!permissions) return '-';
        const permissionKeys = Object.keys(permissions);
        return permissionKeys.length > 0 ? `${permissionKeys.length} permissions` : 'No permissions';
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
      width: 150,
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => {
              setEditingUserRole(record);
              setIsModalVisible(true);
            }}
          />
          <Button 
            icon={<DeleteOutlined />} 
            size="small" 
            danger
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const filteredUserRoles = userRoles?.filter(userRole => {
    const matchesRole = !filterRole || userRole.role === filterRole;
    return matchesRole;
  });

  const adminCount = userRoles?.filter(ur => ur.role === 'admin').length || 0;
  const totalUsers = userRoles?.length || 0;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>User Roles Management</h2>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingUserRole(null);
              setIsModalVisible(true);
            }}
          >
            Assign Role
          </Button>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <Card size="small" style={{ minWidth: '150px' }}>
            <Statistic
              title="Total Users"
              value={totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
          <Card size="small" style={{ minWidth: '150px' }}>
            <Statistic
              title="Administrators"
              value={adminCount}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </div>

        <Select
          placeholder="Filter by role"
          style={{ width: 200 }}
          allowClear
          onChange={setFilterRole}
        >
          <Option value="admin">Admin</Option>
          <Option value="moderator">Moderator</Option>
          <Option value="user">User</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUserRoles}
        loading={isLoading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} user roles`,
        }}
      />

      <Modal
        title={editingUserRole ? 'Edit User Role' : 'Assign User Role'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingUserRole(null);
        }}
        footer={null}
        width={600}
      >
        <UserRoleForm
          userRole={editingUserRole}
          userProfiles={userProfiles}
          onSuccess={() => {
            setIsModalVisible(false);
            setEditingUserRole(null);
            refetch();
          }}
        />
      </Modal>
    </div>
  );
};

export default UserRolesList;
