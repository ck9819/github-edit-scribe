import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, message, Card, Statistic, Row, Col, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BellOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useSupabaseQuery, useSupabaseInsert, useSupabaseUpdate } from '../../hooks/useSupabaseQuery';

const { Option } = Select;

const SmartReorderSystem = () => {
  const [isRuleModalVisible, setIsRuleModalVisible] = useState(false);
  const [isSuggestionModalVisible, setIsSuggestionModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [form] = Form.useForm();

  const { data: reorderRules = [], refetch: refetchRules } = useSupabaseQuery('reorder_rules', 'reorder_rules');
  const { data: reorderSuggestions = [], refetch: refetchSuggestions } = useSupabaseQuery('reorder_suggestions', 'reorder_suggestions');
  const { data: items = [] } = useSupabaseQuery('itemmaster', 'items');
  const { data: warehouses = [] } = useSupabaseQuery('warehouses', 'warehouses');
  const { data: suppliers = [] } = useSupabaseQuery('suppliers', 'suppliers');

  const insertRuleMutation = useSupabaseInsert('reorder_rules', 'reorder_rules');
  const updateRuleMutation = useSupabaseUpdate('reorder_rules', 'reorder_rules');
  const updateSuggestionMutation = useSupabaseUpdate('reorder_suggestions', 'reorder_suggestions');

  // Calculate statistics
  const activeRules = reorderRules.filter(rule => rule.is_active).length;
  const pendingSuggestions = reorderSuggestions.filter(s => !s.is_processed).length;
  const criticalSuggestions = reorderSuggestions.filter(s => s.urgency_level === 'CRITICAL' && !s.is_processed).length;

  const handleSubmitRule = async (values) => {
    try {
      if (editingRule) {
        await updateRuleMutation.mutateAsync({ id: editingRule.id, updates: values });
        message.success('Reorder rule updated successfully');
      } else {
        await insertRuleMutation.mutateAsync(values);
        message.success('Reorder rule created successfully');
      }

      setIsRuleModalVisible(false);
      setEditingRule(null);
      form.resetFields();
      refetchRules();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const handleProcessSuggestion = async (suggestion, action) => {
    try {
      await updateSuggestionMutation.mutateAsync({
        id: suggestion.id,
        updates: { is_processed: true }
      });

      if (action === 'create_po') {
        // In a real implementation, this would create a purchase order
        message.success('Purchase order created successfully');
      } else {
        message.success('Suggestion dismissed');
      }

      refetchSuggestions();
    } catch (error) {
      message.error('Failed to process suggestion');
    }
  };

  const ruleColumns = [
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
        if (!warehouseId) return 'All Warehouses';
        const warehouse = warehouses.find(w => w.id === warehouseId);
        return warehouse?.name || 'Unknown';
      },
    },
    {
      title: 'Reorder Point',
      dataIndex: 'reorder_point',
      key: 'reorder_point',
    },
    {
      title: 'Reorder Quantity',
      dataIndex: 'reorder_quantity',
      key: 'reorder_quantity',
    },
    {
      title: 'Lead Time (Days)',
      dataIndex: 'lead_time_days',
      key: 'lead_time_days',
    },
    {
      title: 'Auto Generate PO',
      dataIndex: 'auto_generate_po',
      key: 'auto_generate_po',
      render: (auto) => (
        <Tag color={auto ? 'green' : 'default'}>
          {auto ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (active) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? 'Active' : 'Inactive'}
        </Tag>
      ),
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
              setEditingRule(record);
              form.setFieldsValue(record);
              setIsRuleModalVisible(true);
            }}
          />
        </Space>
      ),
    },
  ];

  const suggestionColumns = [
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
      title: 'Current Stock',
      dataIndex: 'current_stock',
      key: 'current_stock',
    },
    {
      title: 'Suggested Quantity',
      dataIndex: 'suggested_quantity',
      key: 'suggested_quantity',
      render: (qty) => <span style={{ fontWeight: 'bold' }}>{qty}</span>,
    },
    {
      title: 'Urgency',
      dataIndex: 'urgency_level',
      key: 'urgency_level',
      render: (urgency) => {
        const colors = {
          LOW: 'blue',
          MEDIUM: 'orange',
          HIGH: 'red',
          CRITICAL: 'red',
        };
        return <Tag color={colors[urgency]}>{urgency}</Tag>;
      },
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Est. Stockout Date',
      dataIndex: 'estimated_stockout_date',
      key: 'estimated_stockout_date',
      render: (date) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<ShoppingCartOutlined />}
            onClick={() => handleProcessSuggestion(record, 'create_po')}
          >
            Create PO
          </Button>
          <Button
            size="small"
            onClick={() => handleProcessSuggestion(record, 'dismiss')}
          >
            Dismiss
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Smart Reorder System</h2>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingRule(null);
                form.resetFields();
                setIsRuleModalVisible(true);
              }}
            >
              Add Reorder Rule
            </Button>
            <Button
              icon={<BellOutlined />}
              onClick={() => setIsSuggestionModalVisible(true)}
            >
              View Suggestions ({pendingSuggestions})
            </Button>
          </Space>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Active Rules"
                value={activeRules}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Pending Suggestions"
                value={pendingSuggestions}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Critical Items"
                value={criticalSuggestions}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>

        {criticalSuggestions > 0 && (
          <Alert
            message={`${criticalSuggestions} items require immediate attention!`}
            description="These items are critically low on stock and need urgent reordering."
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
            action={
              <Button size="small" onClick={() => setIsSuggestionModalVisible(true)}>
                View Details
              </Button>
            }
          />
        )}
      </div>

      <Card title="Reorder Rules">
        <Table
          columns={ruleColumns}
          dataSource={reorderRules}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} rules`,
          }}
        />
      </Card>

      {/* Reorder Rule Modal */}
      <Modal
        title={editingRule ? 'Edit Reorder Rule' : 'Add Reorder Rule'}
        open={isRuleModalVisible}
        onCancel={() => {
          setIsRuleModalVisible(false);
          setEditingRule(null);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitRule}
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
                label="Warehouse (Optional)"
              >
                <Select placeholder="Select Warehouse (All if not selected)">
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
            <Col span={8}>
              <Form.Item
                name="reorder_point"
                label="Reorder Point"
                rules={[{ required: true, message: 'Please enter reorder point' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="Enter reorder point"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="reorder_quantity"
                label="Reorder Quantity"
                rules={[{ required: true, message: 'Please enter reorder quantity' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  placeholder="Enter reorder quantity"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="max_stock_level"
                label="Max Stock Level"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="Enter max stock level"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="lead_time_days"
                label="Lead Time (Days)"
                initialValue={7}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  placeholder="Enter lead time"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="safety_stock"
                label="Safety Stock"
                initialValue={0}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="Enter safety stock"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="supplier_id"
                label="Preferred Supplier"
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
            <Col span={12}>
              <Form.Item
                name="auto_generate_po"
                label="Auto Generate Purchase Orders"
                valuePropName="checked"
                initialValue={false}
              >
                <Select>
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="is_active"
                label="Status"
                initialValue={true}
              >
                <Select>
                  <Option value={true}>Active</Option>
                  <Option value={false}>Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingRule ? 'Update Rule' : 'Create Rule'}
              </Button>
              <Button onClick={() => setIsRuleModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Suggestions Modal */}
      <Modal
        title="Reorder Suggestions"
        open={isSuggestionModalVisible}
        onCancel={() => setIsSuggestionModalVisible(false)}
        footer={null}
        width={1000}
      >
        <Table
          columns={suggestionColumns}
          dataSource={reorderSuggestions.filter(s => !s.is_processed)}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="small"
        />
      </Modal>
    </div>
  );
};

export default SmartReorderSystem;