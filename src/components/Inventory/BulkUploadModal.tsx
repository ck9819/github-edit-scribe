
import React, { useState } from 'react';
import { Modal, Button, Upload, Table, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { useSupabaseInsert } from '../../hooks/useSupabaseQuery';

const { Dragger } = Upload;

const BulkUploadModal = ({ onSuccess, onCancel, open }) => {
  const [previewData, setPreviewData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const insertItemMutation = useSupabaseInsert('itemmaster', 'items');

  const generateSKU = () => {
    const timestamp = Date.now();
    return `SKU${timestamp}`;
  };
  
  const handleExcelUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const mappedData = jsonData.map((row: any, index) => ({
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
      } catch (error) {
        message.error('Error reading Excel file. Please check the format.');
        console.error('Excel parsing error:', error);
      }
    };
    reader.readAsArrayBuffer(file);
    return false;
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
        await insertItemMutation.mutateAsync(newItem as any);
      }
      message.success(`${previewData.length} items uploaded successfully`);
      setPreviewData([]);
      onSuccess();
    } catch (error) {
      console.error('Bulk upload error:', error);
      message.error('Failed to upload some items');
    } finally {
      setUploading(false);
    }
  };
  
  const handleCancel = () => {
      setPreviewData([]);
      onCancel();
  }

  const bulkUploadColumns = [
    { title: 'Item Name', dataIndex: 'itemname', key: 'itemname' },
    { title: 'Category', dataIndex: 'itemcategory', key: 'itemcategory' },
    { title: 'Type', dataIndex: 'productservice', key: 'productservice' },
    { title: 'Unit', dataIndex: 'unitofmeasurement', key: 'unitofmeasurement' },
    { title: 'Price', dataIndex: 'defaultprice', key: 'defaultprice' },
    { title: 'Stock', dataIndex: 'currentstock', key: 'currentstock' },
  ];

  return (
    <Modal
      title="Bulk Upload Items from Excel"
      open={open}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="upload"
          type="primary"
          loading={uploading}
          onClick={handleBulkInsert}
          disabled={previewData.length === 0}
        >
          Upload {previewData.length > 0 ? `${previewData.length} Items` : 'Items'}
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
  );
};

export default BulkUploadModal;
