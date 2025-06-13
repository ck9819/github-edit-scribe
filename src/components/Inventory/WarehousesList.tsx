
import React, { useState } from 'react';
import { Table, Button, Space, Tag, Input, message, Modal, Card, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, HomeOutlined } from '@ant-design/icons';
import { useSupabaseQuery, useSupabaseDelete } from '../../hooks/useSupabaseQuery';
import WarehouseForm from './WarehouseForm';

const { Search } = Input;

const WarehousesList = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);

  const { data: warehouses, isLoading, refetch } = useSupabaseQuery('warehouses', 'warehouses');
  const deleteWarehouseMutation = useSupabaseDelete('warehouses', 'warehouses');

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this warehouse?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteWarehouseMutation.mutateAsync(id);
          message.success('Warehouse deleted successfully');
        } catch (error) {
          message.error('Failed to delete warehouse');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      filteredValue: [searchText],
      onFilter: (value, record) => 
        record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Contact Person',
      dataIndex: 'contact_person',
      key: 'contact_person',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
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
              setEditingWarehouse(record);
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

  const filteredWarehouses = warehouses?.filter(warehouse => {
    const matchesSearch = !searchText || 
      warehouse.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (warehouse.contact_person && warehouse.contact_person.toLowerCase().includes(searchText.toLowerCase()));
    
    return matchesSearch;
  });

  const activeWarehouses = warehouses?.filter(w => w.is_active).length || 0;
  const totalWarehouses = warehouses?.length || 0;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Warehouses Management</h2>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingWarehouse(null);
              setIsModalVisible(true);
            }}
          >
            Add New Warehouse
          </Button>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <Card size="small" style={{ minWidth: '150px' }}>
            <Statistic
              title="Total Warehouses"
              value={totalWarehouses}
              prefix={<HomeOutlined />}
            />
          </Card>
          <Card size="small" style={{ minWidth: '150px' }}>
            <Statistic
              title="Active Warehouses"
              value={activeWarehouses}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </div>

        <Search
          placeholder="Search warehouses..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredWarehouses}
        loading={isLoading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} warehouses`,
        }}
      />

      <Modal
        title={editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingWarehouse(null);
        }}
        footer={null}
        width={600}
      >
        <WarehouseForm
          warehouse={editingWarehouse}
          onSuccess={() => {
            setIsModalVisible(false);
            setEditingWarehouse(null);
            refetch();
          }}
        />
      </Modal>
    </div>
  );
};

export default WarehousesList;
