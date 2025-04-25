import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Checkbox, Divider, Row, Col,Table } from 'antd'
import axios from 'axios'


const CompanyForm = () => {
  const [form] = Form.useForm() 
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const columns = [
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

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getAllCompanyies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const onFinish = async (values) => {
    try {
      await axios.post('http://localhost:5000/addCompanyData', values)
      fetchCompanies()
      form.resetFields()
    } catch (error) {
      console.error('Error adding company:', error)
    }
  }

  const onReset = () => {
    form.resetFields()
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
                ]}
              >
                <Input placeholder="Enter Buyer Email" />
              </Form.Item>
              <Form.Item
                name="buyerGst"
                label="Buyer GST"
                rules={[{ required: true, message: 'Please enter buyer GST' }]}
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
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      <Divider />

      <div>
      <Table columns={columns} dataSource={companies} rowKey="itemname" pagination={{ pageSize: 5 }} scroll={{ x: true }}/>
      </div>
    </>
  )
}

export default CompanyForm
