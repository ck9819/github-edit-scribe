import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, DatePicker, InputNumber, Select, message, Card, Statistic, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useSupabaseQuery, useSupabaseInsert, useSupabaseUpdate, useSupabaseDelete } from '../../hooks/useSupabaseQuery';
import dayjs from 'dayjs';

const { Option } = Select;

const BatchManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [form] = Form.useForm();

  const { data: batches = [], isLoading, refetch } = useSupabaseQuery('item_batches', 'item_batches');
  const { data: items = [] } = useSupabaseQuery('itemmaster', 'items');
  const { data: warehouses = [] } = useSupabaseQuery('warehouses', 'warehouses');
  const { data: suppliers = [] } = useSupabaseQuery('suppliers', 'suppliers');

  const insertBatchMutation = useSupabaseInsert('item_batches', 'item_batches');
  const updateBatchMutation = useSupabaseUpdate('item_batches', 'item_batches');
  const deleteBatchMutation = useSupabaseDelete('item_batches', 'item_batches');

  // Calculate statistics
  const totalBatches = batches.length;
  const activeBatches = batches.filter(b => b.status === 'ACTIVE').length;
  const expiringBatches = batches.filter(b => {
    if (!b.expiry_date) return false;
    const daysToExpiry = dayjs(b.expiry_date).diff(dayjs(), 'days');
    return daysToExpiry <= 30 && daysToExpiry >= 0;
  }).length;
  const expiredBatches = batches.filter(b => {
    if (!b.expiry_date) return false;
    return dayjs(b.expiry_date).isBefore(dayjs());
  }).length;

  const handleSubmit = async (values) => {
    try {
      const batchData = {
        ...values,
        manufacturing_date: values.manufacturing_date?.format('YYYY-MM-DD'),
        expiry_date: values.expiry_date?.format('YYYY-MM-DD'),
        quantity_available: values.quantity_received,
      };

      if (editingBatch) {
        await updateBatchMutation.mutateAsync({ id: editingBatch.id, updates: batchData });
        message.success('Batch updated successfully');
      } else {
        await insertBatchMutation.mutateAsync(batchData);
        message.success('Batch created successfully');
      }

      setIsModalVisible(false);
      setEditingBatch(null);
      form.resetFields();
      refetch();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this batch?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteBatchMutation.mutateAsync(id);
          message.success('Batch deleted successfully');
        } catch (error) {
          message.error('Failed to delete batch');
        }
      },
    });
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { status: 'No Expiry', color: 'default' };
    
    const daysToExpiry = dayjs(expiryDate).diff(dayjs(), 'days');
    
    if (daysToExpiry < 0) return { status: 'Expired', color: 'red' };
    if (daysToExpiry <= 7) return { status: 'Critical', color: 'red' };
    if (daysToExpiry <= 30) return { status: 'Warning', color: 'orange' };
    return { status: 'Good', color: 'green' };
  };

  const columns = [
    {
      title: 'Batch Number',
      dataIndex: 'batch_number',
      key: 'batch_number',
    },
    {
      title: 'Item',
      dataIndex: 'item_id',
      key: 'item_id',
      render: (itemId) => {
        const item = items.find(i => i.id === itemId);
        return item?.itemname || 'Unknown';
      },
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouse_id',
      key: 'warehouse_id',
      render: (warehouseId) => {
        const warehouse = warehouses.find(w => w.id === warehouseId);
        return warehouse?.name || 'Unknown';
      },
    },
    {
      title: 'Quantity Available',
      dataIndex: 'quantity_available',
      key: 'quantity_available',
      render: (qty) => <span style={{ fontWeight: 'bold' }}>{qty}</span>,
    },
    {
      title: 'Manufacturing Date',
      dataIndex: 'manufacturing_date',
      key: 'manufacturing_date',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiry_date',
      key: 'expiry_date',
      render: (date) => {
        if (!date) return '-';
        const { status, color } = getExpiryStatus(date);
        return (
          <div>
            <div>{dayjs(date).format('DD/MM/YYYY')}</div>
            <Tag color={color} size="small">{status}</Tag>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          ACTIVE: 'green',
          EXPIRED: 'red',
          RECALLED: 'orange',
          CONSUMED: 'blue',
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
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditingBatch(record);
              form.setFieldsValue({
                ...record,
                manufacturing_date: record.manufacturing_date ? dayjs(record.manufacturing_date) : null,
                expiry_date: record.expiry_date ? dayjs(record.expiry_date) : null,
              });
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
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Batch & Expiry Management</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingBatch(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Add New Batch
          </Button>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Total Batches"
                value={totalBatches}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Active Batches"
                value={activeBatches}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Expiring Soon"
                value={expiringBatches}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Expired"
                value={expiredBatches}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Table
        columns={columns}
        dataSource={batches}
        loading={isLoading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} batches`,
        }}
      />

      <Modal
        title={editingBatch ? 'Edit Batch' : 'Add New Batch'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingBatch(null);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="item_id"
                label="Item"
                rules={[{ required: true, message: 'Please select an item' }]}
              >
                <Select placeholder="Select Item">
                  {items.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.itemname}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="warehouse_id"
                label="Warehouse"
                rules={[{ required: true, message: 'Please select a warehouse' }]}
              >
                <Select placeholder="Select Warehouse">
                  {warehouses.map(warehouse => (
                    <Option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="batch_number"
                label="Batch Number"
                rules={[{ required: true, message: 'Please enter batch number' }]}
              >
                <Input placeholder="Enter batch number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="supplier_id"
                label="Supplier"
              >
                <Select placeholder="Select Supplier">
                  {suppliers.map(supplier => (
                    <Option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="quantity_received"
                label="Quantity Received"
                rules={[{ required: true, message: 'Please enter quantity' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="Enter quantity"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="unit_cost"
                label="Unit Cost"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  placeholder="Enter unit cost"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Status"
                initialValue="ACTIVE"
              >
                <Select>
                  <Option value="ACTIVE">Active</Option>
                  <Option value="EXPIRED">Expired</Option>
                  <Option value="RECALLED">Recalled</Option>
                  <Option value="CONSUMED">Consumed</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="manufacturing_date"
                label="Manufacturing Date"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="expiry_date"
                label="Expiry Date"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="notes"
            label="Notes"
          >
            <Input.TextArea rows={3} placeholder="Enter any notes..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingBatch ? 'Update Batch' : 'Create Batch'}
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

export default BatchManagement;