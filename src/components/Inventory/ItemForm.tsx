
import React, { useEffect, useState } from 'react';
import { Form, Button, message, Card, Col, Row } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSupabaseInsert, useSupabaseUpdate } from '../../hooks/useSupabaseQuery';
import ItemImageUploader from './ItemImageUploader';
import BulkUploadModal from './BulkUploadModal';
import ItemFormFields from './ItemFormFields';

const ItemForm = ({ item, categories, onSuccess }) => {
  const [form] = Form.useForm();
  const [bulkUploadVisible, setBulkUploadVisible] = useState(false);
  const [itemImages, setItemImages] = useState([]);
  
  const insertItemMutation = useSupabaseInsert('itemmaster', 'items');
  const updateItemMutation = useSupabaseUpdate('itemmaster', 'items');

  useEffect(() => {
    if (item) {
      form.setFieldsValue(item);
      if (item.images) {
        setItemImages(item.images);
      } else {
        setItemImages([]);
      }
    } else {
      form.resetFields();
      setItemImages([]);
    }
  }, [item, form]);

  const generateSKU = () => {
    const timestamp = Date.now();
    return `SKU${timestamp}`;
  };

  const handleSubmit = async (values) => {
    try {
      const itemData = {
        ...values,
        images: itemImages,
      };

      if (item) {
        await updateItemMutation.mutateAsync({ id: item.id, updates: itemData });
        message.success('Item updated successfully');
      } else {
        const finalItemData = {
          ...itemData,
          itemid: generateSKU(),
        };
        await insertItemMutation.mutateAsync(finalItemData);
        message.success('Item created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Item operation error:', error);
      message.error(item ? 'Failed to update item' : 'Failed to create item');
    }
  };
  
  const handleBulkUploadSuccess = () => {
    setBulkUploadVisible(false);
    onSuccess();
  }

  return (
    <>
      <Card>
        <div className="mb-4 flex gap-4">
          <Button 
            type="dashed" 
            icon={<UploadOutlined />}
            onClick={() => setBulkUploadVisible(true)}
          >
            Bulk Upload from Excel
          </Button>
        </div>

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
            <Col span={24}>
              <Form.Item label="Item Images">
                <ItemImageUploader images={itemImages} onImagesChange={setItemImages} />
              </Form.Item>
            </Col>
          </Row>
          
          <ItemFormFields categories={categories} />

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={insertItemMutation.isPending || updateItemMutation.isPending}>
              {item ? 'Update Item' : 'Create Item'}
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <BulkUploadModal
        open={bulkUploadVisible}
        onCancel={() => setBulkUploadVisible(false)}
        onSuccess={handleBulkUploadSuccess}
      />
    </>
  );
};

export default ItemForm;
