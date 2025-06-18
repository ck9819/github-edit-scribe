import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, DatePicker, Select, InputNumber, message, Card, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, FilePdfOutlined, MailOutlined } from '@ant-design/icons';
import { useSupabaseQuery, useSupabaseInsert, useSupabaseUpdate } from '../../hooks/useSupabaseQuery';
import { supabase } from '../../integrations/supabase/client';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const InvoiceManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [form] = Form.useForm();

  const { data: invoices = [], isLoading, refetch } = useSupabaseQuery('invoices', 'invoices');
  const { data: customers = [] } = useSupabaseQuery('customers', 'customers');
  const { data: warehouses = [] } = useSupabaseQuery('warehouses', 'warehouses');
  const { data: items = [] } = useSupabaseQuery('itemmaster', 'items');

  const insertInvoiceMutation = useSupabaseInsert('invoices', 'invoices');
  const updateInvoiceMutation = useSupabaseUpdate('invoices', 'invoices');

  const generateInvoiceNumber = async () => {
    try {
      const { data, error } = await supabase.rpc('generate_invoice_number');
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating invoice number:', error);
      return `INV/${new Date().getFullYear()}/${String(Date.now()).slice(-6)}`;
    }
  };

  const handleSubmit = async (values) => {
    try {
      let invoiceData = {
        ...values,
        invoice_date: values.invoice_date.format('YYYY-MM-DD'),
        due_date: values.due_date?.format('YYYY-MM-DD'),
      };

      if (!editingInvoice) {
        const invoiceNumber = await generateInvoiceNumber();
        invoiceData.invoice_number = invoiceNumber;
      }

      if (editingInvoice) {
        await updateInvoiceMutation.mutateAsync({ id: editingInvoice.id, updates: invoiceData });
        message.success('Invoice updated successfully');
      } else {
        await insertInvoiceMutation.mutateAsync(invoiceData);
        message.success('Invoice created successfully');
      }

      setIsModalVisible(false);
      setEditingInvoice(null);
      form.resetFields();
      refetch();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const handleGeneratePDF = async (invoice) => {
    try {
      // In a real implementation, this would call an edge function to generate PDF
      message.info('PDF generation feature will be implemented with edge functions');
    } catch (error) {
      message.error('Failed to generate PDF');
    }
  };

  const handleSendEmail = async (invoice) => {
    try {
      // In a real implementation, this would send email via edge function
      message.info('Email sending feature will be implemented with edge functions');
    } catch (error) {
      message.error('Failed to send email');
    }
  };

  const calculateGST = (amount, rate = 18) => {
    const gstAmount = (amount * rate) / 100;
    return {
      cgst: gstAmount / 2,
      sgst: gstAmount / 2,
      igst: 0, // For interstate transactions
      total: gstAmount,
    };
  };

  const columns = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoice_number',
      key: 'invoice_number',
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
    {
      title: 'Customer',
      dataIndex: 'customer_id',
      key: 'customer_id',
      render: (customerId) => {
        const customer = customers.find(c => c.id === customerId);
        return customer?.name || 'Unknown';
      },
    },
    {
      title: 'Invoice Date',
      dataIndex: 'invoice_date',
      key: 'invoice_date',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      key: 'due_date',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount) => `₹${amount?.toLocaleString() || 0}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          DRAFT: 'orange',
          SENT: 'blue',
          PAID: 'green',
          OVERDUE: 'red',
          CANCELLED: 'gray',
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Payment Status',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (status) => {
        const colors = {
          PENDING: 'orange',
          PARTIAL: 'blue',
          PAID: 'green',
          OVERDUE: 'red',
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
            icon={<EyeOutlined />}
            size="small"
            onClick={() => console.log('View invoice:', record.id)}
          />
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditingInvoice(record);
              form.setFieldsValue({
                ...record,
                invoice_date: dayjs(record.invoice_date),
                due_date: record.due_date ? dayjs(record.due_date) : null,
              });
              setIsModalVisible(true);
            }}
          />
          <Button
            icon={<FilePdfOutlined />}
            size="small"
            onClick={() => handleGeneratePDF(record)}
          />
          <Button
            icon={<MailOutlined />}
            size="small"
            onClick={() => handleSendEmail(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Invoice Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingInvoice(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Create Invoice
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {invoices.length}
              </div>
              <div style={{ color: '#666' }}>Total Invoices</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                {invoices.filter(inv => inv.payment_status === 'PAID').length}
              </div>
              <div style={{ color: '#666' }}>Paid</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                {invoices.filter(inv => inv.payment_status === 'PENDING').length}
              </div>
              <div style={{ color: '#666' }}>Pending</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                {invoices.filter(inv => inv.payment_status === 'OVERDUE').length}
              </div>
              <div style={{ color: '#666' }}>Overdue</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={invoices}
        loading={isLoading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} invoices`,
        }}
      />

      <Modal
        title={editingInvoice ? 'Edit Invoice' : 'Create Invoice'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingInvoice(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customer_id"
                label="Customer"
                rules={[{ required: true, message: 'Please select a customer' }]}
              >
                <Select placeholder="Select Customer">
                  {customers.map(customer => (
                    <Option key={customer.id} value={customer.id}>
                      {customer.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="warehouse_id"
                label="Warehouse"
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
                name="invoice_date"
                label="Invoice Date"
                rules={[{ required: true, message: 'Please select invoice date' }]}
                initialValue={dayjs()}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="due_date"
                label="Due Date"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="subtotal"
                label="Subtotal"
                rules={[{ required: true, message: 'Please enter subtotal' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  placeholder="Enter subtotal"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="discount_amount"
                label="Discount Amount"
                initialValue={0}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  placeholder="Enter discount"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="tax_amount"
                label="Tax Amount"
                rules={[{ required: true, message: 'Please enter tax amount' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  placeholder="Enter tax amount"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="cgst_amount"
                label="CGST Amount"
                initialValue={0}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  placeholder="CGST"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="sgst_amount"
                label="SGST Amount"
                initialValue={0}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  placeholder="SGST"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="igst_amount"
                label="IGST Amount"
                initialValue={0}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  placeholder="IGST"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="total_amount"
                label="Total Amount"
                rules={[{ required: true, message: 'Please enter total amount' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  placeholder="Enter total amount"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                initialValue="DRAFT"
              >
                <Select>
                  <Option value="DRAFT">Draft</Option>
                  <Option value="SENT">Sent</Option>
                  <Option value="PAID">Paid</Option>
                  <Option value="OVERDUE">Overdue</Option>
                  <Option value="CANCELLED">Cancelled</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="payment_terms"
            label="Payment Terms"
          >
            <Input placeholder="e.g., Net 30 days" />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea rows={3} placeholder="Enter any notes..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
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

export default InvoiceManagement;