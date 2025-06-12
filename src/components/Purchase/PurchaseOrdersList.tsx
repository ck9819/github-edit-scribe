
import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Select, DatePicker, Input, message } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import { supabase } from '../../integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

const { Option } = Select;

const PurchaseOrdersList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: purchaseOrders = [], isLoading } = useSupabaseQuery('purchase_orders', 'purchase_orders');
  const { data: suppliers = [] } = useSupabaseQuery('suppliers', 'suppliers', { is_active: true });

  const handleCreatePO = async (values) => {
    try {
      // Generate PO number
      const { data: serialData } = await supabase.rpc('get_next_serial_number', {
        form_type_param: 'PO'
      });
      
      const poNumber = `PO/${new Date().getFullYear()}/${String(serialData).padStart(5, '0')}`;

      await supabase
        .from('purchase_orders')
        .insert([{
          ...values,
          po_number: poNumber,
          order_date: values.order_date.format('YYYY-MM-DD'),
          expected_delivery_date: values.expected_delivery_date?.format('YYYY-MM-DD'),
        }]);

      message.success('Purchase Order created successfully');
      queryClient.invalidateQueries({ queryKey: ['purchase_orders'] });
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to create Purchase Order');
    }
  };

  const columns = [
    {
      title: 'PO Number',
      dataIndex: 'po_number',
      key: 'po_number',
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier_id',
      key: 'supplier_id',
      render: (supplier_id) => {
        const supplier = suppliers.find(s => s.id === supplier_id);
        return supplier?.name || 'Unknown';
      },
    },
    {
      title: 'Order Date',
      dataIndex: 'order_date',
      key: 'order_date',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Expected Delivery',
      dataIndex: 'expected_delivery_date',
      key: 'expected_delivery_date',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          PENDING: 'orange',
          CONFIRMED: 'blue',
          PARTIAL_RECEIVED: 'yellow',
          RECEIVED: 'green',
          CANCELLED: 'red',
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
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
            onClick={() => console.log('View PO:', record.id)}
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
        <h2>Purchase Orders</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Create Purchase Order
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={purchaseOrders}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Create Purchase Order"
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
          onFinish={handleCreatePO}
          layout="vertical"
        >
          <Form.Item
            name="supplier_id"
            label="Supplier"
            rules={[{ required: true, message: 'Please select supplier' }]}
          >
            <Select placeholder="Select Supplier">
              {suppliers.map(supplier => (
                <Option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="order_date"
            label="Order Date"
            rules={[{ required: true, message: 'Please select order date' }]}
          >
            <DatePicker style={{ width: '100%' }} defaultValue={dayjs()} />
          </Form.Item>

          <Form.Item
            name="expected_delivery_date"
            label="Expected Delivery Date"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Notes"
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Purchase Order
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

export default PurchaseOrdersList;
