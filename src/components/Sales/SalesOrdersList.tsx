
import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Select, DatePicker, Input, message, InputNumber } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import { supabase } from '../../integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

const { Option } = Select;

const SalesOrdersList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: salesOrders = [], isLoading } = useSupabaseQuery('sales', 'sales_orders');
  const { data: customers = [] } = useSupabaseQuery('customers', 'customers', { is_active: true });
  const { data: warehouses = [] } = useSupabaseQuery('warehouses', 'warehouses', { is_active: true });

  const handleCreateSalesOrder = async (values) => {
    try {
      // Generate SO number
      const { data: serialData } = await supabase.rpc('get_next_serial_number', {
        form_type_param: 'SO'
      });
      
      const soNumber = `SO/${new Date().getFullYear()}/${String(serialData).padStart(5, '0')}`;

      await supabase
        .from('sales')
        .insert([{
          enquiry_id: soNumber,
          customer_id: values.customer_id,
          warehouse_id: values.warehouse_id,
          deal_status: 'CONFIRMED',
          payment_method: values.payment_method,
          discount_amount: values.discount_amount || 0,
          created_at: new Date().toISOString(),
        }]);

      message.success('Sales Order created successfully');
      queryClient.invalidateQueries({ queryKey: ['sales_orders'] });
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to create Sales Order');
    }
  };

  const columns = [
    {
      title: 'SO Number',
      dataIndex: 'enquiry_id',
      key: 'enquiry_id',
    },
    {
      title: 'Customer',
      dataIndex: 'customer_id',
      key: 'customer_id',
      render: (customer_id) => {
        const customer = customers.find(c => c.id === customer_id);
        return customer?.name || 'Unknown';
      },
    },
    {
      title: 'Order Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'deal_status',
      key: 'deal_status',
      render: (status) => {
        const colors = {
          PENDING: 'orange',
          CONFIRMED: 'blue',
          DELIVERED: 'green',
          CANCELLED: 'red',
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Payment Method',
      dataIndex: 'payment_method',
      key: 'payment_method',
    },
    {
      title: 'Payment Status',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (status) => {
        const colors = {
          PENDING: 'orange',
          PAID: 'green',
          PARTIAL: 'blue',
          OVERDUE: 'red',
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_after_tax',
      key: 'total_after_tax',
      render: (amount) => amount ? `₹${amount.toLocaleString()}` : 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => console.log('View SO:', record.id)}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Sales Orders</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Create Sales Order
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={salesOrders}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Create Sales Order"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          onFinish={handleCreateSalesOrder}
          layout="vertical"
        >
          <Form.Item
            name="customer_id"
            label="Customer"
            rules={[{ required: true, message: 'Please select customer' }]}
          >
            <Select placeholder="Select Customer">
              {customers.map(customer => (
                <Option key={customer.id} value={customer.id}>
                  {customer.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="warehouse_id"
            label="Warehouse"
            rules={[{ required: true, message: 'Please select warehouse' }]}
          >
            <Select placeholder="Select Warehouse">
              {warehouses.map(warehouse => (
                <Option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="payment_method"
            label="Payment Method"
            initialValue="CASH"
          >
            <Select>
              <Option value="CASH">Cash</Option>
              <Option value="CREDIT">Credit</Option>
              <Option value="BANK_TRANSFER">Bank Transfer</Option>
              <Option value="CHEQUE">Cheque</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="discount_amount"
            label="Discount Amount"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder="Enter discount amount"
              prefix="₹"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Sales Order
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

export default SalesOrdersList;
