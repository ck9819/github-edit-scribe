
import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Divider, Row, Col, Typography, Table, message } from 'antd';
import { useItems, useAddItem, useGenerateItemId } from '../store/hooks/supabaseHooks';

const { Option } = Select;
const { Text } = Typography;

const PartForm = () => {
  const [form] = Form.useForm();
  const { data: items = [], isLoading, error } = useItems();
  const addItemMutation = useAddItem();
  const generateItemIdMutation = useGenerateItemId();
  const [generatedItemId, setGeneratedItemId] = useState('');

  useEffect(() => {
    generateNewItemId();
  }, []);

  const generateNewItemId = async () => {
    try {
      const itemId = await generateItemIdMutation.mutateAsync('SKU');
      setGeneratedItemId(itemId);
      form.setFieldValue('itemId', itemId);
    } catch (error) {
      console.error('Error generating item ID:', error);
      message.error('Failed to generate item ID');
    }
  };

  const columns = [
    { title: 'Item ID', dataIndex: 'itemid', key: 'itemid' },
    { title: 'Item Name', dataIndex: 'itemname', key: 'itemname' },
    { title: 'Product/Service', dataIndex: 'productservice', key: 'productservice' },
    { title: 'Buy/Sell/Both', dataIndex: 'buysellboth', key: 'buysellboth' },
    { title: 'Unit of Measurement', dataIndex: 'unitofmeasurement', key: 'unitofmeasurement' },
    { title: 'Item Category', dataIndex: 'itemcategory', key: 'itemcategory' },
    { title: 'Current Stock', dataIndex: 'currentstock', key: 'currentstock' },
    { title: 'Default Price', dataIndex: 'defaultprice', key: 'defaultprice' },
    { title: 'HSN Code', dataIndex: 'hsncode', key: 'hsncode' },
    { title: 'Tax', dataIndex: 'tax', key: 'tax' },
  ];

  const onFinish = async (values) => {
    try {
      const itemData = {
        itemid: generatedItemId,
        itemname: values.itemName,
        productservice: values.productService,
        buysellboth: values.buySellBoth,
        unitofmeasurement: values.unitOfMeasurement,
        itemcategory: values.itemCategory,
        currentstock: parseInt(values.currentStock) || 0,
        defaultprice: parseFloat(values.defaultPrice) || null,
        hsncode: values.hsnCode || null,
        tax: values.tax || null,
        minimumstocklevel: parseInt(values.minimumStockLevel) || 0,
        maximumstocklevel: parseInt(values.maximumStockLevel) || null,
        drawingnumber: null,
        serialnumber: null,
        counterpartycode: null,
      };

      await addItemMutation.mutateAsync(itemData);
      message.success('Item added successfully');
      form.resetFields();
      generateNewItemId();
    } catch (error) {
      console.error('Error adding item:', error);
      message.error('Failed to add item');
    }
  };

  const onReset = () => {
    form.resetFields();
    generateNewItemId();
  };

  if (error) {
    message.error('Error loading items');
  }

  return (
    <>
      <Form form={form} name="item_form" layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="itemId"
              label="Item Id"
              rules={[{ required: true, message: 'Please input the Item Id!' }]}
            >
              <Input value={generatedItemId} disabled />
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
              <Input type="number" />
            </Form.Item>
            <Form.Item name="hsnCode" label="HSN Code">
              <Input />
            </Form.Item>
            <Form.Item name="minimumStockLevel" label="Minimum Stock Level">
              <Input type="number" />
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
              <Input type="number" step="0.01" />
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
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={24}>
            <Text>Custom Fields</Text>
            <Divider />
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="drawingNumber" label="Drawing Number">
              <Input disabled />
            </Form.Item>
            <Form.Item name="serialNumber" label="Serial Number">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="counterPartyCode" label="Counter Party Code">
              <Input disabled />
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
                loading={addItemMutation.isPending}
              >
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
        <Table 
          columns={columns} 
          dataSource={items} 
          rowKey="id" 
          pagination={{ pageSize: 5 }} 
          scroll={{ x: true }}
          loading={isLoading}
        />
      </div>
    </>
  );
};

export default PartForm;
