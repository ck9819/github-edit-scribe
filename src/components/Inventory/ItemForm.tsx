import React, { useEffect, useState } from 'react';
import { Form, Input, Select, InputNumber, Switch, Button, Row, Col, message, Upload, Modal, Table, Card, Image } from 'antd';
import { UploadOutlined, InboxOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSupabaseInsert, useSupabaseUpdate } from '../../hooks/useSupabaseQuery';
import * as XLSX from 'xlsx';
import { supabase } from '../../integrations/supabase/client';

const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const ItemForm = ({ item, categories, brands, onSuccess }) => {
  const [form] = Form.useForm();
  const [bulkUploadVisible, setBulkUploadVisible] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [itemImages, setItemImages] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);
  
  const insertItemMutation = useSupabaseInsert('itemmaster', 'items');
  const updateItemMutation = useSupabaseUpdate('itemmaster', 'items');

  useEffect(() => {
    if (item) {
      form.setFieldsValue(item);
      // Load existing images if any
      if (item.images) {
        setItemImages(item.images);
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

  const handleExcelUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Map Excel columns to our item structure
        const mappedData = jsonData.map((row, index) => ({
          key: index,
          itemname: row['Item Name'] || row['itemname'] || '',
          itemcategory: row['Category'] || row['itemcategory'] || '',
          productservice: row['Type'] || row['productservice'] || 'Product',
          buysellboth: row['Buy/Sell'] || row['buysellboth'] || 'Both',
          unitofmeasurement: row['Unit'] || row['unitofmeasurement'] || 'pcs',
          defaultprice: parseFloat(row['Price'] || row['defaultprice'] || 0),
          hsncode: row['HSN Code'] || row['hsncode'] || '',
          currentstock: parseInt(row['Current Stock'] || row['currentstock'] || 0),
          reorder_level: parseInt(row['Reorder Level'] || row['reorder_level'] || 10),
          minimumstocklevel: parseInt(row['Minimum Stock'] || row['minimumstocklevel'] || 5),
        }));
        
        setPreviewData(mappedData);
        setBulkUploadVisible(true);
      } catch (error) {
        message.error('Error reading Excel file. Please check the format.');
        console.error('Excel parsing error:', error);
      }
    };
    reader.readAsArrayBuffer(file);
    return false; // Prevent default upload
  };

  const handleBulkInsert = async () => {
    setUploading(true);
    try {
      for (const itemData of previewData) {
        const newItem = {
          ...itemData,
          itemid: generateSKU(),
          is_active: true,
          expiry_tracking: false,
        };
        await insertItemMutation.mutateAsync(newItem);
      }
      message.success(`${previewData.length} items uploaded successfully`);
      setBulkUploadVisible(false);
      setPreviewData([]);
      onSuccess();
    } catch (error) {
      console.error('Bulk upload error:', error);
      message.error('Failed to upload some items');
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (file) => {
    setImageUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `item-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('item-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('item-images')
        .getPublicUrl(filePath);

      const newImage = {
        uid: Date.now(),
        name: file.name,
        status: 'done',
        url: data.publicUrl,
        path: filePath
      };

      setItemImages(prev => [...prev, newImage]);
      message.success('Image uploaded successfully');
    } catch (error) {
      console.error('Image upload error:', error);
      message.error('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
    return false;
  };

  const handleRemoveImage = async (image) => {
    try {
      if (image.path) {
        await supabase.storage
          .from('item-images')
          .remove([image.path]);
      }
      setItemImages(prev => prev.filter(img => img.uid !== image.uid));
      message.success('Image removed successfully');
    } catch (error) {
      console.error('Error removing image:', error);
      message.error('Failed to remove image');
    }
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

  const bulkUploadColumns = [
    { title: 'Item Name', dataIndex: 'itemname', key: 'itemname' },
    { title: 'Category', dataIndex: 'itemcategory', key: 'itemcategory' },
    { title: 'Type', dataIndex: 'productservice', key: 'productservice' },
    { title: 'Unit', dataIndex: 'unitofmeasurement', key: 'unitofmeasurement' },
    { title: 'Price', dataIndex: 'defaultprice', key: 'defaultprice' },
    { title: 'Stock', dataIndex: 'currentstock', key: 'currentstock' },
  ];

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
          {/* Item Images Section */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Item Images">
                <div className="space-y-4">
                  <Upload
                    beforeUpload={handleImageUpload}
                    showUploadList={false}
                    accept="image/*"
                    disabled={imageUploading}
                  >
                    <Button icon={<UploadOutlined />} loading={imageUploading}>
                      Upload Image
                    </Button>
                  </Upload>
                  
                  {itemImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-4">
                      {itemImages.map((image) => (
                        <div key={image.uid} className="relative">
                          <Image
                            width={100}
                            height={100}
                            src={image.url}
                            alt={image.name}
                            style={{ objectFit: 'cover' }}
                          />
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            className="absolute top-0 right-0"
                            onClick={() => handleRemoveImage(image)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Form.Item>
            </Col>
          </Row>

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
      </Card>

      {/* Bulk Upload Modal */}
      <Modal
        title="Bulk Upload Items from Excel"
        open={bulkUploadVisible}
        onCancel={() => setBulkUploadVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setBulkUploadVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="upload"
            type="primary"
            loading={uploading}
            onClick={handleBulkInsert}
            disabled={previewData.length === 0}
          >
            Upload {previewData.length} Items
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <div>
            <p className="mb-2">Upload Excel file with the following columns:</p>
            <p className="text-sm text-gray-600 mb-4">
              Item Name, Category, Type, Buy/Sell, Unit, Price, HSN Code, Current Stock, Reorder Level, Minimum Stock
            </p>
          </div>
          
          <Dragger
            beforeUpload={handleExcelUpload}
            accept=".xlsx,.xls"
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag Excel file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for .xlsx and .xls files only
            </p>
          </Dragger>

          {previewData.length > 0 && (
            <div>
              <h4>Preview ({previewData.length} items):</h4>
              <Table
                columns={bulkUploadColumns}
                dataSource={previewData}
                pagination={{ pageSize: 5 }}
                size="small"
                scroll={{ x: true }}
              />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ItemForm;
