
import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Select, DatePicker, Input, message, InputNumber } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import { supabase } from '../../integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

const { Option } = Select;

const GoodsReceiptsList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: goodsReceipts = [], isLoading } = useSupabaseQuery('goods_receipts', 'goods_receipts');
  const { data: purchaseOrders = [] } = useSupabaseQuery('purchase_orders', 'purchase_orders', { status: 'CONFIRMED' });
  const { data: warehouses = [] } = useSupabaseQuery('warehouses', 'warehouses', { is_active: true });
  const { data: suppliers = [] } = useSupabaseQuery('suppliers', 'suppliers');

  const handleCreateGRN = async (values) => {
    try {
      // Generate GRN number
      const { data: serialData } = await supabase.rpc('get_next_serial_number', {
        form_type_param: 'GRN'
      });
      
      const grnNumber = `GRN/${new Date().getFullYear()}/${String(serialData).padStart(5, '0')}`;

      const { data: grn } = await supabase
        .from('goods_receipts')
        .insert([{
          grn_number: grnNumber,
          po_id: values.po_id,
          warehouse_id: values.warehouse_id,
          receipt_date: values.receipt_date.format('YYYY-MM-DD'),
          notes: values.notes,
          status: 'DRAFT'
        }])
        .select()
        .single();

      message.success('Goods Receipt created successfully');
      queryClient.invalidateQueries({ queryKey: ['goods_receipts'] });
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to create Goods Receipt');
    }
  };

  const columns = [
    {
      title: 'GRN Number',
      dataIndex: 'grn_number',
      key: 'grn_number',
    },
    {
      title: 'PO Number',
      dataIndex: 'po_id',
      key: 'po_id',
      render: (po_id) => {
        const po = purchaseOrders.find(p => p.id === po_id);
        return po?.po_number || 'Unknown';
      },
    },
    {
      title: 'Supplier',
      dataIndex: 'po_id',
      key: 'supplier',
      render: (po_id) => {
        const po = purchaseOrders.find(p => p.id === po_id);
        const supplier = suppliers.find(s => s.id === po?.supplier_id);
        return supplier?.name || 'Unknown';
      },
    },
    {
      title: 'Receipt Date',
      dataIndex: 'receipt_date',
      key: 'receipt_date',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouse_id',
      key: 'warehouse_id',
      render: (warehouse_id) => {
        const warehouse = warehouses.find(w => w.id === warehouse_id);
        return warehouse?.name || 'Unknown';
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          DRAFT: 'orange',
          CONFIRMED: 'green',
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => console.log('View GRN:', record.id)}
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
        <h2>Goods Receipts</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Create Goods Receipt
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={goodsReceipts}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Create Goods Receipt"
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
          onFinish={handleCreateGRN}
          layout="vertical"
        >
          <Form.Item
            name="po_id"
            label="Purchase Order"
            rules={[{ required: true, message: 'Please select purchase order' }]}
          >
            <Select placeholder="Select Purchase Order">
              {purchaseOrders.map(po => (
                <Option key={po.id} value={po.id}>
                  {po.po_number}
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
            name="receipt_date"
            label="Receipt Date"
            rules={[{ required: true, message: 'Please select receipt date' }]}
          >
            <DatePicker style={{ width: '100%' }} defaultValue={dayjs()} />
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
                Create Goods Receipt
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

export default GoodsReceiptsList;
