
import React, { useEffect } from 'react';
import { Form, Input, Switch, Button, Row, Col, message } from 'antd';
import { useSupabaseInsert, useSupabaseUpdate } from '../../hooks/useSupabaseQuery';

const { TextArea } = Input;

const WarehouseForm = ({ warehouse, onSuccess }) => {
  const [form] = Form.useForm();
  const insertWarehouseMutation = useSupabaseInsert('warehouses', 'warehouses');
  const updateWarehouseMutation = useSupabaseUpdate('warehouses', 'warehouses');

  useEffect(() => {
    if (warehouse) {
      form.setFieldsValue(warehouse);
    } else {
      form.resetFields();
    }
  }, [warehouse, form]);

  const handleSubmit = async (values) => {
    try {
      if (warehouse) {
        await updateWarehouseMutation.mutateAsync({ id: warehouse.id, updates: values });
        message.success('Warehouse updated successfully');
      } else {
        await insertWarehouseMutation.mutateAsync(values);
        message.success('Warehouse created successfully');
      }
      onSuccess();
    } catch (error) {
      message.error(warehouse ? 'Failed to update warehouse' : 'Failed to create warehouse');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        is_active: true,
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Warehouse Name"
            rules={[{ required: true, message: 'Please enter warehouse name' }]}
          >
            <Input placeholder="Enter warehouse name" />
          </Form.Item>
        </Col>
        
        <Col span={12}>
          <Form.Item
            name="contact_person"
            label="Contact Person"
          >
            <Input placeholder="Enter contact person name" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="phone"
            label="Phone Number"
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
        </Col>
        
        <Col span={12}>
          <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="address"
        label="Address"
      >
        <TextArea 
          rows={3}
          placeholder="Enter warehouse address"
        />
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={insertWarehouseMutation.isPending || updateWarehouseMutation.isPending}
        >
          {warehouse ? 'Update Warehouse' : 'Create Warehouse'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default WarehouseForm;
