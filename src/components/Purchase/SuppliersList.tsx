
import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, InputNumber, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import { supabase } from '../../integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const SuppliersList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: suppliers = [], isLoading } = useSupabaseQuery('suppliers', 'suppliers');

  const handleAddEdit = async (values) => {
    try {
      if (editingSupplier) {
        await supabase
          .from('suppliers')
          .update(values)
          .eq('id', editingSupplier.id);
        message.success('Supplier updated successfully');
      } else {
        await supabase
          .from('suppliers')
          .insert([values]);
        message.success('Supplier added successfully');
      }
      
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setIsModalVisible(false);
      form.resetFields();
      setEditingSupplier(null);
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await supabase
        .from('suppliers')
        .update({ is_active: false })
        .eq('id', id);
      
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      message.success('Supplier deactivated successfully');
    } catch (error) {
      message.error('Failed to deactivate supplier');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Contact Person',
      dataIndex: 'contact_person',
      key: 'contact_person',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'GST Number',
      dataIndex: 'gst_number',
      key: 'gst_number',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active) => (
        <Tag color={is_active ? 'green' : 'red'}>
          {is_active ? 'Active' : 'Inactive'}
        </Tag>
      ),
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
              setEditingSupplier(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Deactivate
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Suppliers Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingSupplier(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Add Supplier
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={suppliers}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingSupplier(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleAddEdit}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Supplier Name"
            rules={[{ required: true, message: 'Please enter supplier name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="contact_person"
            label="Contact Person"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: 'email', message: 'Please enter valid email' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="gst_number"
            label="GST Number"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="payment_terms"
            label="Payment Terms (Days)"
          >
            <InputNumber min={0} defaultValue={30} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingSupplier ? 'Update' : 'Add'} Supplier
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

export default SuppliersList;
