
import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Row, Col, message, DatePicker } from 'antd';
import { useCompanies, useItems, useAddSalesEnquiry, useGenerateSerialNumber } from '../store/hooks/supabaseHooks';

const { Option } = Select;
const { TextArea } = Input;

const SalesEnquiryForm = () => {
  const [form] = Form.useForm();
  const { data: companies = [] } = useCompanies();
  const { data: items = [] } = useItems();
  const addSalesEnquiryMutation = useAddSalesEnquiry();
  const generateSerialNumberMutation = useGenerateSerialNumber();
  const [enquiryId, setEnquiryId] = useState('');

  useEffect(() => {
    generateEnquiryId();
  }, []);

  const generateEnquiryId = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      const startYear = currentYear.toString().slice(-2);
      const endYear = nextYear.toString().slice(-2);
      
      const serialNumber = await generateSerialNumberMutation.mutateAsync({
        prefix: 'YPE/SE',
        startYear,
        endYear
      });
      
      setEnquiryId(serialNumber);
      form.setFieldValue('enquiryId', serialNumber);
    } catch (error) {
      console.error('Error generating enquiry ID:', error);
      message.error('Failed to generate enquiry ID');
    }
  };

  const onFinish = async (values) => {
    try {
      const salesData = {
        enquiry_id: enquiryId,
        buyer_details: {
          name: values.buyerName,
          email: values.buyerEmail,
          contact: values.buyerContact
        },
        delivery_location: {
          address: values.deliveryAddress
        },
        place_of_supply: {
          location: values.placeOfSupply
        },
        email_recipients: values.emailRecipients,
        deal_owner: values.dealOwner,
        deal_status: 'Pending',
        created_by: values.dealOwner,
      };

      await addSalesEnquiryMutation.mutateAsync(salesData);
      message.success('Sales enquiry created successfully');
      form.resetFields();
      generateEnquiryId();
    } catch (error) {
      console.error('Error creating sales enquiry:', error);
      message.error('Failed to create sales enquiry');
    }
  };

  const onReset = () => {
    form.resetFields();
    generateEnquiryId();
  };

  return (
    <Form form={form} name="sales_enquiry_form" layout="vertical" onFinish={onFinish}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="enquiryId"
            label="Enquiry ID"
            rules={[{ required: true, message: 'Please input the Enquiry ID!' }]}
          >
            <Input value={enquiryId} disabled />
          </Form.Item>
          
          <Form.Item
            name="buyerName"
            label="Buyer Name"
            rules={[{ required: true, message: 'Please select or input buyer name!' }]}
          >
            <Select
              showSearch
              placeholder="Select or type buyer name"
              optionFilterProp="children"
              allowClear
            >
              {companies.map(company => (
                <Option key={company.id} value={company.buyername}>
                  {company.buyername}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="buyerEmail"
            label="Buyer Email"
            rules={[
              { required: true, message: 'Please input buyer email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="buyerContact"
            label="Buyer Contact"
            rules={[{ required: true, message: 'Please input buyer contact!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        
        <Col span={12}>
          <Form.Item
            name="dealOwner"
            label="Deal Owner"
            rules={[{ required: true, message: 'Please input deal owner!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="deliveryAddress"
            label="Delivery Address"
            rules={[{ required: true, message: 'Please input delivery address!' }]}
          >
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item
            name="placeOfSupply"
            label="Place of Supply"
            rules={[{ required: true, message: 'Please input place of supply!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="emailRecipients"
            label="Email Recipients"
          >
            <TextArea rows={2} placeholder="Enter email addresses separated by commas" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item>
            <Button
              type="default"
              onClick={onReset}
              style={{ marginRight: '10px' }}
            >
              Reset
            </Button>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={addSalesEnquiryMutation.isPending}
            >
              Create Enquiry
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SalesEnquiryForm;
