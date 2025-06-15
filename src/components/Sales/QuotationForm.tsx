
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Row, Col, DatePicker, Table, Card, InputNumber, message, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import { supabase } from '../../integrations/supabase/client';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface QuotationItem {
  key: string;
  description: string;
  hsnSacCode: string;
  quantity: number;
  unit: string;
  rate: number;
  taxableAmount: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  total: number;
}

const QuotationForm = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [quotationData, setQuotationData] = useState<any>(null);

  const { data: customers = [] } = useSupabaseQuery('customers', 'customers', { is_active: true });
  const { data: inventoryItems = [] } = useSupabaseQuery('items', 'itemmaster', { is_active: true });

  useEffect(() => {
    generateQuotationNumber();
  }, []);

  const generateQuotationNumber = async () => {
    try {
      const { data } = await supabase.rpc('get_next_serial_number', {
        form_type_param: 'QTN'
      });
      const quotationNumber = `YPE/QTN/${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(-2)}/${String(data).padStart(4, '0')}`;
      form.setFieldValue('quotationNumber', quotationNumber);
    } catch (error) {
      console.error('Error generating quotation number:', error);
    }
  };

  const addItem = () => {
    const newItem: QuotationItem = {
      key: Date.now().toString(),
      description: '',
      hsnSacCode: '',
      quantity: 1,
      unit: 'Nos',
      rate: 0,
      taxableAmount: 0,
      cgstRate: 9,
      cgstAmount: 0,
      sgstRate: 9,
      sgstAmount: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (key: string) => {
    setItems(items.filter(item => item.key !== key));
  };

  const updateItem = (key: string, field: keyof QuotationItem, value: any) => {
    const updatedItems = items.map(item => {
      if (item.key === key) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate amounts when quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
          updatedItem.taxableAmount = updatedItem.quantity * updatedItem.rate;
          updatedItem.cgstAmount = (updatedItem.taxableAmount * updatedItem.cgstRate) / 100;
          updatedItem.sgstAmount = (updatedItem.taxableAmount * updatedItem.sgstRate) / 100;
          updatedItem.total = updatedItem.taxableAmount + updatedItem.cgstAmount + updatedItem.sgstAmount;
        }
        
        return updatedItem;
      }
      return item;
    });
    setItems(updatedItems);
  };

  const calculateTotals = () => {
    const totalTaxableAmount = items.reduce((sum, item) => sum + item.taxableAmount, 0);
    const totalCGST = items.reduce((sum, item) => sum + item.cgstAmount, 0);
    const totalSGST = items.reduce((sum, item) => sum + item.sgstAmount, 0);
    const grandTotal = totalTaxableAmount + totalCGST + totalSGST;

    return {
      totalTaxableAmount,
      totalCGST,
      totalSGST,
      grandTotal
    };
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      width: 50,
      render: (text: string, record: QuotationItem, index: number) => index + 1,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: 200,
      render: (text: string, record: QuotationItem) => (
        <Select
          style={{ width: '100%' }}
          placeholder="Select item"
          value={record.description || undefined}
          onChange={(value) => {
            const selectedItem = inventoryItems.find(item => item.itemname === value);
            if (selectedItem) {
              updateItem(record.key, 'description', value);
              updateItem(record.key, 'hsnSacCode', selectedItem.hsncode || '');
              updateItem(record.key, 'rate', selectedItem.price || 0);
            }
          }}
          showSearch
          optionFilterProp="children"
        >
          {inventoryItems.map(item => (
            <Option key={item.id} value={item.itemname}>
              {item.itemname}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'HSN/SAC Code',
      dataIndex: 'hsnSacCode',
      width: 120,
      render: (text: string, record: QuotationItem) => (
        <Input
          value={record.hsnSacCode}
          onChange={(e) => updateItem(record.key, 'hsnSacCode', e.target.value)}
        />
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      width: 100,
      render: (text: number, record: QuotationItem) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => updateItem(record.key, 'quantity', value || 1)}
        />
      ),
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      width: 80,
      render: (text: string, record: QuotationItem) => (
        <Select
          value={record.unit}
          onChange={(value) => updateItem(record.key, 'unit', value)}
        >
          <Option value="Nos">Nos</Option>
          <Option value="Kg">Kg</Option>
          <Option value="Meter">Meter</Option>
          <Option value="Liter">Liter</Option>
        </Select>
      ),
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      width: 100,
      render: (text: number, record: QuotationItem) => (
        <InputNumber
          min={0}
          value={record.rate}
          onChange={(value) => updateItem(record.key, 'rate', value || 0)}
          prefix="₹"
        />
      ),
    },
    {
      title: 'Taxable Amount',
      dataIndex: 'taxableAmount',
      width: 120,
      render: (text: number) => `₹${text.toFixed(2)}`,
    },
    {
      title: 'CGST (9%)',
      dataIndex: 'cgstAmount',
      width: 100,
      render: (text: number) => `₹${text.toFixed(2)}`,
    },
    {
      title: 'SGST (9%)',
      dataIndex: 'sgstAmount',
      width: 100,
      render: (text: number) => `₹${text.toFixed(2)}`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      width: 120,
      render: (text: number) => `₹${text.toFixed(2)}`,
    },
    {
      title: 'Action',
      width: 80,
      render: (text: any, record: QuotationItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeItem(record.key)}
        />
      ),
    },
  ];

  const handlePreview = () => {
    const formValues = form.getFieldsValue();
    const selectedCustomer = customers.find(c => c.id === formValues.customerId);
    const totals = calculateTotals();

    setQuotationData({
      ...formValues,
      customer: selectedCustomer,
      items,
      totals,
      date: dayjs().format('DD/MM/YYYY')
    });
    setPreviewVisible(true);
  };

  const handleSendQuotation = async () => {
    try {
      setLoading(true);
      const formValues = form.getFieldsValue();
      const selectedCustomer = customers.find(c => c.id === formValues.customerId);
      const totals = calculateTotals();

      // Call edge function to generate and send PDF
      const { data, error } = await supabase.functions.invoke('send-quotation', {
        body: {
          quotationData: {
            ...formValues,
            customer: selectedCustomer,
            items,
            totals,
            date: dayjs().format('DD/MM/YYYY')
          }
        }
      });

      if (error) throw error;

      message.success('Quotation sent successfully!');
      form.resetFields();
      setItems([]);
      generateQuotationNumber();
    } catch (error) {
      console.error('Error sending quotation:', error);
      message.error('Failed to send quotation');
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Create Quotation" style={{ marginBottom: '24px' }}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="quotationNumber"
                label="Quotation Number"
                rules={[{ required: true }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="quotationDate"
                label="Quotation Date"
                rules={[{ required: true }]}
                initialValue={dayjs()}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="customerId"
                label="Customer"
                rules={[{ required: true }]}
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
            <Col span={6}>
              <Form.Item
                name="validUntil"
                label="Valid Until"
                rules={[{ required: true }]}
                initialValue={dayjs().add(30, 'day')}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="paymentTerms"
                label="Payment Terms"
                initialValue="45 days"
              >
                <Input placeholder="e.g., 30 days" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deliveryPeriod"
                label="Delivery Period"
                initialValue="10-15 days"
              >
                <Input placeholder="e.g., 2-3 weeks" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="remarks"
                label="Remarks"
              >
                <TextArea rows={3} placeholder="Any additional remarks..." />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card title="Items" style={{ marginBottom: '24px' }}>
        <Button
          type="dashed"
          onClick={addItem}
          style={{ marginBottom: '16px' }}
          icon={<PlusOutlined />}
        >
          Add Item
        </Button>
        
        <Table
          columns={columns}
          dataSource={items}
          pagination={false}
          scroll={{ x: 1200 }}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={6}>
                <strong>Total</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6}>
                <strong>₹{totals.totalTaxableAmount.toFixed(2)}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={7}>
                <strong>₹{totals.totalCGST.toFixed(2)}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={8}>
                <strong>₹{totals.totalSGST.toFixed(2)}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={9}>
                <strong>₹{totals.grandTotal.toFixed(2)}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={10} />
            </Table.Summary.Row>
          )}
        />
      </Card>

      <Row gutter={16}>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button
            type="default"
            onClick={handlePreview}
            style={{ marginRight: '8px' }}
            disabled={items.length === 0}
          >
            Preview
          </Button>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendQuotation}
            loading={loading}
            disabled={items.length === 0}
          >
            Send Quotation
          </Button>
        </Col>
      </Row>

      <Modal
        title="Quotation Preview"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={800}
      >
        {quotationData && (
          <div style={{ padding: '20px' }}>
            <h3>Quotation Preview</h3>
            <p><strong>Quotation Number:</strong> {quotationData.quotationNumber}</p>
            <p><strong>Date:</strong> {quotationData.date}</p>
            <p><strong>Customer:</strong> {quotationData.customer?.name}</p>
            <p><strong>Total Amount:</strong> ₹{quotationData.totals.grandTotal.toFixed(2)}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuotationForm;
