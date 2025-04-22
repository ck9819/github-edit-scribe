import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Divider, Row, Col,Typography, Table  } from 'antd'
import axios from 'axios'

const { Option } = Select
const {Text} =Typography

const PartForm = () => {
  const [form] = Form.useForm()
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const columns = [
    { title: 'Item Name', dataIndex: 'itemname', key: 'itemname' },
    { title: 'Product/Service', dataIndex: 'productservice', key: 'productservice' },
    { title: 'Buy/Sell/Both', dataIndex: 'buysellboth', key: 'buysellboth' },
    { title: 'Unit of Measurement', dataIndex: 'unitofmeasurement', key: 'unitofmeasurement' },
    { title: 'Item Category', dataIndex: 'itemcategory', key: 'itemcategory' },
    { title: 'Current Stock', dataIndex: 'currentstock', key: 'currentstock' },
    { title: 'Default Price', dataIndex: 'defaultprice', key: 'defaultprice' },
    { title: 'HSN Code', dataIndex: 'hsncode', key: 'hsncode' },
    { title: 'Tax', dataIndex: 'tax', key: 'tax' },
    { title: 'Minimum Stock Level', dataIndex: 'minimumstocklevel', key: 'minimumstocklevel' },
    { title: 'Maximum Stock Level', dataIndex: 'maximumstocklevel', key: 'maximumstocklevel' },
    { title: 'Drawing Number', dataIndex: 'drawingnumber', key: 'drawingnumber' },
    { title: 'Serial Number', dataIndex: 'serialnumber', key: 'serialnumber' },
    { title: 'Counter Party Code', dataIndex: 'counterpartycode', key: 'counterpartycode' },
  ];

  // Fetch all items
  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getAllItems');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const onFinish = async (values) => {
    try {
      form.validateFields()
      console.log(values);
      const itemDetails = {...values, drawingNumber:'null', serialNumber:'null',counterPartyCode:'null'}
      const response = await axios.post('http://localhost:5000/addItem', itemDetails)
      const result = response.data
      if (result.message === "Item added successfully") {
        console.log('Item added successfully:', result)
        fetchItems();
        form.resetFields()
      } else {
        console.error('Error adding item:', result.message)
      }
      
    } catch (error) {
      console.error('Error adding company:', error)
    }
  }

  const onReset = () => {
    form.resetFields()
  }


  return (
    <>
      <Form form={form}  name="item_form" layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="itemId"
              label="Item Id"
              rules={[{ required: true, message: 'Please input the Item Id!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="productService"
              label="Product/Service"
              rules={[
                { required: true, message: 'Please select Product/Service!' },
              ]}
            >
              <Select placeholder="Select a option">
                <Option value="product">Product</Option>
                <Option value="service">Service</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="unitOfMeasurement"
              label="Unit of Measurement (UoM)"
              rules={[{ required: true, message: 'Please select UoM!' }]}
            >
              <Select placeholder="Select a option">
                <Option value="kg">Kg</Option>
                <Option value="liter">Liter</Option>
                <Option value="Meter">Meter</Option>
                <Option value="Nos">Nos</Option>
                <Option value="Set">Set</Option>
                <Option value="Packs">Packs</Option>
                <Option value="Square feet">Square feet</Option>
                <Option value="ROLL">ROLL</Option>
              </Select>
            </Form.Item>
            <Form.Item name="currentStock" label="Current Stock">
              <Input />
            </Form.Item>
            <Form.Item name="hsnCode" label="HSN Code">
              <Input />
            </Form.Item>
            <Form.Item name="minimumStockLevel" label="Minimum Stock Level">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="itemName"
              label="Item Name"
              rules={[
                { required: true, message: 'Please input the Item Name!' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="buySellBoth"
              label="Buy/Sell/Both"
              rules={[
                { required: true, message: 'Please select Buy/Sell/Both!' },
              ]}
            >
              <Select placeholder="Select a option">
                <Option value="buy">Buy</Option>
                <Option value="sell">Sell</Option>
                <Option value="both">Both</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="itemCategory"
              label="Item Category"
              rules={[
                { required: true, message: 'Please select Item Category!' },
              ]}
            >
              <Select placeholder="Select a category">
                <Option value="Finished Goods">Finished Goods</Option>
                <Option value="Raw Materials">Raw Materials</Option>
                <Option value="Semi-finished Goods">Semi-finished Goods</Option>
                <Option value="Consumables">Consumables</Option>
                <Option value="Bought out Parts">Bought out Parts</Option>
                <Option value="Trading Goods">Trading Goods</Option>
                <Option value="Service">Service</Option>
                <Option value="Item Category">Item Category</Option>
              </Select>
            </Form.Item>

            <Form.Item name="defaultPrice" label="Default Price">
              <Input />
            </Form.Item>

            <Form.Item name="tax" label="Tax">
            <Select placeholder="Select a tax">
                <Option value="Tax:5%">Tax:5%</Option>
                <Option value="Tax:28%">Tax:28%</Option>
                <Option value="Tax:12%">Tax:12%</Option>
                <Option value="Tax:18%">Tax:18%</Option>
                <Option value="Tax:3%">Tax:3%</Option>
                <Option value="Tax:0.1%">Tax:0.1%</Option>
                <Option value="Tax:0%">Tax:0%</Option>
                <Option value="Tax:0.25%">Tax:0.25%</Option>
              </Select>
            </Form.Item>

            <Form.Item name="maximumStockLevel" label="Maximum Stock Level">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}><Text>Custom Fields</Text><Divider/></Col>
          </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="drawingNumber" label="Drawing Number">
              <Input disabled = {true}/>
            </Form.Item>
            <Form.Item name="serialNumber" label="Serial Number">
              <Input disabled = {true}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="counterPartyCode" label="Counter Party Code">
              <Input disabled ={true}/>
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
      <div>
        <Divider />
      </div>
      <div>
      <Table columns={columns} dataSource={items} rowKey="itemid" pagination={{ pageSize: 5 }} scroll={{ x: true }}/>
      </div>
    </>
  )
}

export default PartForm
