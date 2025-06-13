
import React, { useEffect } from 'react';
import { Form, Input, Select, InputNumber, Switch, Button, Row, Col, message } from 'antd';
import { useSupabaseInsert, useSupabaseUpdate } from '../../hooks/useSupabaseQuery';

const { Option } = Select;
const { TextArea } = Input;

const ItemForm = ({ item, categories, brands, onSuccess }) => {
  const [form] = Form.useForm();
  const insertItemMutation = useSupabaseInsert('itemmaster', 'items');
  const updateItemMutation = useSupabaseUpdate('itemmaster', 'items');

  useEffect(() => {
    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
    }
  }, [item, form]);

  const generateSKU = () => {
    const timestamp = Date.now();
    return `SKU${timestamp}`;
  };

  const handleSubmit = async (values) => {
    try {
      if (item) {
        await updateItemMutation.mutateAsync({ id: item.id, updates: values });
        message.success('Item updated successfully');
      } else {
        const itemData = {
          ...values,
          itemid: generateSKU(),
        };
        await insertItemMutation.mutateAsync(itemData);
        message.success('Item created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Item operation error:', error);
      message.error(item ? 'Failed to update item' : 'Failed to create item');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        productservice: 'Product',
        buysellboth: 'Both',
        unitofmeasurement: 'pcs',
        is_active: true,
        expiry_tracking: false,
        currentstock: 0,
        reorder_level: 10,
        minimumstocklevel: 5,
      }}
    >
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
            name="itemcategory"
            label="Category"
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select placeholder="Select category">
              {categories?.map(category => (
                <Option key={category.id} value={category.name}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="productservice"
            label="Type"
            rules={[{ required: true, message: 'Please select type' }]}
          >
            <Select>
              <Option value="Product">Product</Option>
              <Option value="Service">Service</Option>
            </Select>
          </Form.Item>
        </Col>
        
        <Col span={12}>
          <Form.Item
            name="buysellboth"
            label="Buy/Sell"
            rules={[{ required: true, message: 'Please select option' }]}
          >
            <Select>
              <Option value="Buy">Buy</Option>
              <Option value="Sell">Sell</Option>
              <Option value="Both">Both</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="unitofmeasurement"
            label="Unit of Measurement"
            rules={[{ required: true, message: 'Please enter unit' }]}
          >
            <Select>
              <Option value="pcs">Pieces</Option>
              <Option value="kg">Kilograms</Option>
              <Option value="ltr">Liters</Option>
              <Option value="mtr">Meters</Option>
              <Option value="box">Box</Option>
            </Select>
          </Form.Item>
        </Col>
        
        <Col span={8}>
          <Form.Item
            name="defaultprice"
            label="Default Price"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter price"
              min={0}
              precision={2}
            />
          </Form.Item>
        </Col>
        
        <Col span={8}>
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
              placeholder="Enter current stock"
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
            label="Minimum Stock"
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

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={insertItemMutation.isPending || updateItemMutation.isPending}>
          {item ? 'Update Item' : 'Create Item'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ItemForm;
