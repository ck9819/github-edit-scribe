import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Card, Statistic, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TagsOutlined } from '@ant-design/icons';
import { useSupabaseQuery, useSupabaseInsert, useSupabaseUpdate, useSupabaseDelete } from '../../hooks/useSupabaseQuery';

const { Option } = Select;
const { TextArea } = Input;

const CategoriesManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  const { data: categories = [], isLoading, refetch } = useSupabaseQuery('categories', 'categories');
  const insertCategoryMutation = useSupabaseInsert('categories', 'categories');
  const updateCategoryMutation = useSupabaseUpdate('categories', 'categories');
  const deleteCategoryMutation = useSupabaseDelete('categories', 'categories');

  // Calculate statistics
  const totalCategories = categories.length;
  const parentCategories = categories.filter(cat => !cat.parent_category_id).length;
  const subCategories = categories.filter(cat => cat.parent_category_id).length;

  const handleSubmit = async (values) => {
    try {
      if (editingCategory) {
        await updateCategoryMutation.mutateAsync({ id: editingCategory.id, updates: values });
        message.success('Category updated successfully');
      } else {
        await insertCategoryMutation.mutateAsync(values);
        message.success('Category created successfully');
      }

      setIsModalVisible(false);
      setEditingCategory(null);
      form.resetFields();
      refetch();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this category?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteCategoryMutation.mutateAsync(id);
          message.success('Category deleted successfully');
        } catch (error) {
          message.error('Failed to delete category');
        }
      },
    });
  };

  const getParentCategoryName = (parentId) => {
    if (!parentId) return '-';
    const parent = categories.find(cat => cat.id === parentId);
    return parent?.name || 'Unknown';
  };

  const columns = [
    {
      title: 'Name',
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
      title: 'Parent Category',
      dataIndex: 'parent_category_id',
      key: 'parent_category_id',
      render: (parentId) => getParentCategoryName(parentId),
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
              setEditingCategory(record);
              form.setFieldsValue(record);
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

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Categories Management</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingCategory(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Add New Category
          </Button>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Categories"
                value={totalCategories}
                prefix={<TagsOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Parent Categories"
                value={parentCategories}
                prefix={<TagsOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Sub Categories"
                value={subCategories}
                prefix={<TagsOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        loading={isLoading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} categories`,
        }}
      />

      <Modal
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingCategory(null);
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
            label="Category Name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item
            name="parent_category_id"
            label="Parent Category (Optional)"
          >
            <Select placeholder="Select parent category" allowClear>
              {categories
                .filter(cat => !editingCategory || cat.id !== editingCategory.id)
                .map(category => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} placeholder="Enter category description" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingCategory ? 'Update Category' : 'Create Category'}
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

export default CategoriesManagement;