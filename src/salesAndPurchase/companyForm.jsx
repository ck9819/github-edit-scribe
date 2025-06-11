
import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Divider, Row, Col, Table, message } from 'antd';
import { validateEmail, gstinValidator, validatePhoneNumber } from '../utils';
import { useCompanies, useAddCompany } from '../store/hooks/supabaseHooks';

const CompanyForm = () => {
  const [form] = Form.useForm();
  const { data: companies = [], isLoading, error } = useCompanies();
  const addCompanyMutation = useAddCompany();

  const columns = [
    {
      title: 'Buyer Name',
      dataIndex: 'buyername',
      key: 'buyername',
    },
    {
      title: 'Buyer Address',
      dataIndex: 'buyeraddress',
      key: 'buyeraddress',
    },
    {
      title: 'Buyer Email',
      dataIndex: 'buyeremail',
      key: 'buyeremail',
    },
    {
      title: 'Buyer Contact',
      dataIndex: 'buyercontact',
      key: 'buyercontact',
    },
    {
      title: 'Buyer GST',
      dataIndex: 'buyergst',
      key: 'buyergst',
    },
    {
      title: 'Delivery Address',
      dataIndex: 'deliveryaddress',
      key: 'deliveryaddress',
    },
  ];

  const onFinish = async (values) => {
    try {
      // Transform form values to match database schema
      const companyData = {
        buyername: values.buyerName,
        buyeremail: values.buyerEmail,
        buyergst: values.buyerGst,
        buyercontact: values.buyerContact,
        buyeraddress: values.buyerAddress,
        deliveryaddress: values.sameAsBuyerAddress ? values.buyerAddress : values.deliveryAddress,
        sameasbuyeraddress: values.sameAsBuyerAddress || false,
      };

      await addCompanyMutation.mutateAsync(companyData);
      message.success('Company added successfully');
      form.resetFields();
    } catch (error) {
      console.error('Error adding company:', error);
      message.error('Failed to add company');
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  if (error) {
    message.error('Error loading companies');
  }

  return (
    <>
      <div>
        <Form
          form={form}
          name="company_form"
          onFinish={onFinish}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="buyerName"
                label="Buyer Name"
                rules={[{ required: true, message: 'Please enter buyer name' }]}
              >
                <Input placeholder="Enter Buyer Name" />
              </Form.Item>
              <Form.Item
                name="buyerEmail"
                label="Buyer Email"
                rules={[
                  { required: true, message: 'Please enter buyer email' },
                  { validator: validateEmail },
                ]}
              >
                <Input placeholder="Enter Buyer Email" />
              </Form.Item>
              <Form.Item
                name="buyerGst"
                label="Buyer GST"
                rules={[
                  { required: true, message: 'Please enter buyer GST' },
                  { validator: gstinValidator },
                ]}
              >
                <Input placeholder="Enter Buyer GST" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="buyerAddress"
                label="Buyer Address"
                rules={[
                  { required: true, message: 'Please enter buyer address' },
                ]}
              >
                <Input.TextArea placeholder="Enter Buyer Address" />
              </Form.Item>
              <Form.Item
                name="buyerContact"
                label="Buyer Contact"
                rules={[
                  { required: true, message: 'Please enter buyer contact' },
                  { validator: validatePhoneNumber },
                ]}
              >
                <Input placeholder="Enter Buyer Contact" />
              </Form.Item>
              <Form.Item
                name="deliveryAddress"
                label="Delivery Address"
                rules={[
                  { required: true, message: 'Please enter delivery address' },
                ]}
              >
                <Input.TextArea placeholder="Enter Delivery Address" />
              </Form.Item>
              <Form.Item name="sameAsBuyerAddress" valuePropName="checked">
                <Checkbox>Same as buyer address</Checkbox>
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
                  loading={addCompanyMutation.isPending}
                >
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      <Divider />

      <div>
        <Table 
          columns={columns} 
          dataSource={companies} 
          rowKey="id" 
          pagination={{ pageSize: 5 }} 
          scroll={{ x: true }}
          loading={isLoading}
        />
      </div>
    </>
  );
};

export default CompanyForm;
