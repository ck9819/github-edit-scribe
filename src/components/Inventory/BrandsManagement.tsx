import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Card, Statistic, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useSupabaseQuery, useSupabaseInsert, useSupabaseUpdate, useSupabaseDelete } from '../../hooks/useSupabaseQuery';

const { TextArea } = Input;

const BrandsManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [form] = Form.useForm();

  const { data: brands = [], isLoading, refetch } = useSupabaseQuery('brands', 'brands');
  const { data: items = [] } = useSupabaseQuery('itemmaster', 'items');
  const insertBrandMutation = useSupabaseInsert('brands', 'brands');
  const updateBrandMutation = useSupabaseUpdate('brands', 'brands');
  const deleteBrandMutation = useSupabaseDelete('brands', 'brands');

  // Calculate statistics
  const totalBrands = brands.length;
  const brandsWithItems = brands.filter(brand => 
    items.some(item => item.brand_id === brand.id)
  ).length;
  const unusedBrands = totalBrands - brandsWithItems;

  const handleSubmit = async (values) => {
    try {
      if (editingBrand) {
        await updateBrandMutation.mutateAsync({ id: editingBrand.id, updates: values });
        message.success('Brand updated successfully');
      } else {
        await insertBrandMutation.mutateAsync(values);
        message.success('Brand created successfully');
      }

      setIsModalVisible(false);
      setEditingBrand(null);
      form.resetFields();
      refetch();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const handleDelete = (id) => {
    // Check if brand is being used by any items
    const isUsed = items.some(item => item.brand_id === id);
    
    if (isUsed) {
      message.error('Cannot delete brand as it is being used by one or more items');
      return;
    }

    Modal.confirm({
      title: 'Are you sure you want to delete this brand?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteBrandMutation.mutateAsync(id);
          message.success('Brand deleted successfully');
        } catch (error) {
          message.error('Failed to delete brand');
        }
      },
    });
  };

  const getItemCount = (brandId) => {
    return items.filter(item => item.brand_id === brandId).length;
  };

  const columns = [
    {
      title: 'Brand Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Items Count',
      key: 'items_count',
      render: (_, record) => {
        const count = getItemCount(record.id);
        return (
          <span style={{ 
            color: count > 0 ? '#52c41a' : '#8c8c8c',
            fontWeight: count > 0 ? 'bold' : 'normal'
          }}>
            {count} items
          </span>
        );
      },
    },
    {
      title: 'Created Date',
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
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditingBrand(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(record.id)}
            disabled={getItemCount(record.id) > 0}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Brands Management</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingBrand(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Add New Brand
          </Button>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Brands"
                value={totalBrands}
                prefix={<AppstoreOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Brands with Items"
                value={brandsWithItems}
                prefix={<AppstoreOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Unused Brands"
                value={unusedBrands}
                prefix={<AppstoreOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Table
        columns={columns}
        dataSource={brands}
        loading={isLoading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} brands`,
        }}
      />

      <Modal
        title={editingBrand ? 'Edit Brand' : 'Add New Brand'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingBrand(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Brand Name"
            rules={[{ required: true, message: 'Please enter brand name' }]}
          >
            <Input placeholder="Enter brand name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} placeholder="Enter brand description" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingBrand ? 'Update Brand' : 'Create Brand'}
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

export default BrandsManagement;