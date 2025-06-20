
import React from 'react';
import { Form, Input, Select, Switch, InputNumber, Row, Col } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const ItemFormFields = ({ categories }) => {
  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="itemname"
            label="Item Name"
            rules={[{ required: true, message: 'Please enter item name' }]}
          >
            <Input placeholder="Enter item name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="itemid"
            label="Item ID"
          >
            <Input placeholder="Auto-generated" disabled />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="category_id"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Select category">
              {categories?.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="productservice"
            label="Product/Service"
            rules={[{ required: true, message: 'Please select type' }]}
          >
            <Select placeholder="Select type">
              <Option value="Product">Product</Option>
              <Option value="Service">Service</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="buysellboth"
            label="Buy/Sell/Both"
            rules={[{ required: true, message: 'Please select option' }]}
          >
            <Select placeholder="Select option">
              <Option value="Buy">Buy</Option>
              <Option value="Sell">Sell</Option>
              <Option value="Both">Both</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="unitofmeasurement"
            label="Unit of Measurement"
            rules={[{ required: true, message: 'Please enter unit' }]}
          >
            <Input placeholder="e.g., pcs, kg, liter" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="defaultprice"
            label="Default Price"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter price"
              min={0}
              step={0.01}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="hsncode"
            label="HSN Code"
          >
            <Input placeholder="Enter HSN code" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="currentstock"
            label="Current Stock"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter stock"
              min={0}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="reorder_level"
            label="Reorder Level"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter reorder level"
              min={0}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="minimumstocklevel"
            label="Minimum Stock Level"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter minimum stock"
              min={0}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="tax"
            label="Tax"
          >
            <Select placeholder="Select tax rate">
              <Option value="Tax:0%">Tax: 0%</Option>
              <Option value="Tax:5%">Tax: 5%</Option>
              <Option value="Tax:12%">Tax: 12%</Option>
              <Option value="Tax:18%">Tax: 18%</Option>
              <Option value="Tax:28%">Tax: 28%</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="maximumstocklevel"
            label="Maximum Stock Level"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter maximum stock"
              min={0}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="expiry_tracking"
            label="Track Expiry"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="description"
        label="Description"
      >
        <TextArea rows={3} placeholder="Enter item description" />
      </Form.Item>
    </>
  );
};

export default ItemFormFields;
