
import React, { useState } from 'react';
import { Table, Button, Space, Tag, Input, Select, message, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useSupabaseQuery, useSupabaseDelete } from '../../hooks/useSupabaseQuery';
import ItemForm from './ItemForm';

const { Search } = Input;
const { Option } = Select;

const ItemsList = () => {
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { data: items, isLoading, refetch } = useSupabaseQuery('itemmaster', 'items');
  const { data: categories } = useSupabaseQuery('categories', 'categories');
  const { data: brands } = useSupabaseQuery('brands', 'brands');
  const deleteItemMutation = useSupabaseDelete('itemmaster', 'items');

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this item?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteItemMutation.mutateAsync(id);
          message.success('Item deleted successfully');
        } catch (error) {
          message.error('Failed to delete item');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Item ID',
      dataIndex: 'itemid',
      key: 'itemid',
      width: 120,
    },
    {
      title: 'Name',
      dataIndex: 'itemname',
      key: 'itemname',
      filteredValue: [searchText],
      onFilter: (value, record) => 
        record.itemname.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Category',
      dataIndex: 'itemcategory',
      key: 'itemcategory',
      filters: categories?.map(cat => ({ text: cat.name, value: cat.name })) || [],
      onFilter: (value, record) => record.itemcategory === value,
    },
    {
      title: 'Product/Service',
      dataIndex: 'productservice',
      key: 'productservice',
      render: (value) => (
        <Tag color={value === 'Product' ? 'blue' : 'green'}>{value}</Tag>
      ),
    },
    {
      title: 'Unit Price',
      dataIndex: 'defaultprice',
      key: 'defaultprice',
      render: (price) => price ? `₹${parseFloat(price).toFixed(2)}` : '-',
    },
    {
      title: 'Current Stock',
      dataIndex: 'currentstock',
      key: 'currentstock',
      render: (stock, record) => {
        const isLowStock = stock <= record.reorder_level;
        return (
          <span style={{ color: isLowStock ? 'red' : 'inherit' }}>
            {stock || 0} {record.unitofmeasurement}
            {isLowStock && <Tag color="red" style={{ marginLeft: 8 }}>Low Stock</Tag>}
          </span>
        );
      },
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
              setEditingItem(record);
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

  const filteredItems = items?.filter(item => {
    const matchesSearch = !searchText || 
      item.itemname.toLowerCase().includes(searchText.toLowerCase()) ||
      item.itemid.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesCategory = !filterCategory || item.itemcategory === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <Search
            placeholder="Search items..."
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Filter by category"
            style={{ width: 200 }}
            allowClear
            onChange={setFilterCategory}
          >
            {categories?.map(category => (
              <Option key={category.id} value={category.name}>
                {category.name}
              </Option>
            ))}
          </Select>
        </div>
        
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingItem(null);
            setIsModalVisible(true);
          }}
        >
          Add New Item
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredItems}
        loading={isLoading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      />

      <Modal
        title={editingItem ? 'Edit Item' : 'Add New Item'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingItem(null);
        }}
        footer={null}
        width={800}
      >
        <ItemForm
          item={editingItem}
          categories={categories}
          brands={brands}
          onSuccess={() => {
            setIsModalVisible(false);
            setEditingItem(null);
            refetch();
          }}
        />
      </Modal>
    </div>
  );
};

export default ItemsList;
