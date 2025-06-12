
import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, InputNumber, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import { supabase } from '../../integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const CustomersList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading } = useSupabaseQuery('customers', 'customers');

  const handleAddEdit = async (values) => {
    try {
      if (editingCustomer) {
        await supabase
          .from('customers')
          .update(values)
          .eq('id', editingCustomer.id);
        message.success('Customer updated successfully');
      } else {
        await supabase
          .from('customers')
          .insert([values]);
        message.success('Customer added successfully');
      }
      
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setIsModalVisible(false);
      form.resetFields();
      setEditingCustomer(null);
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await supabase
        .from('customers')
        .update({ is_active: false })
        .eq('id', id);
      
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      message.success('Customer deactivated successfully');
    } catch (error) {
      message.error('Failed to deactivate customer');
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
      title: 'Credit Limit',
      dataIndex: 'credit_limit',
      key: 'credit_limit',
      render: (amount) => `₹${amount?.toLocaleString() || 0}`,
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
              setEditingCustomer(record);
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
        <h2>Customers Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCustomer(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Add Customer
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={customers}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingCustomer(null);
        }}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          onFinish={handleAddEdit}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Customer Name"
            rules={[{ required: true, message: 'Please enter customer name' }]}
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
            name="billing_address"
            label="Billing Address"
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            name="shipping_address"
            label="Shipping Address"
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            name="gst_number"
            label="GST Number"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="credit_limit"
            label="Credit Limit"
          >
            <InputNumber min={0} defaultValue={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="payment_terms"
            label="Payment Terms (Days)"
          >
            <InputNumber min={0} defaultValue={30} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingCustomer ? 'Update' : 'Add'} Customer
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

export default CustomersList;
