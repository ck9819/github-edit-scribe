
import React, { useState } from 'react';
import { Modal, Upload, Button, message, Table } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { useSupabaseInsert } from '../../hooks/useSupabaseQuery';

const { Dragger } = Upload;

const BulkUploadModal = ({ open, onCancel, onSuccess }) => {
  const [fileData, setFileData] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  const insertItemMutation = useSupabaseInsert('itemmaster', 'items');

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        setFileData(jsonData);
        message.success('File parsed successfully');
      } catch (error) {
        message.error('Error parsing file');
      }
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  const generateSKU = () => {
    const timestamp = Date.now();
    return `SKU${timestamp}`;
  };

  const handleBulkUpload = async () => {
    if (fileData.length === 0) {
      message.error('Please upload a file first');
      return;
    }

    setUploading(true);
    try {
      for (const row of fileData) {
        const itemData = {
          itemid: generateSKU(),
          itemname: row.itemname || row['Item Name'] || '',
          productservice: row.productservice || row['Product/Service'] || 'Product',
          buysellboth: row.buysellboth || row['Buy/Sell/Both'] || 'Both',
          unitofmeasurement: row.unitofmeasurement || row['Unit'] || 'pcs',
          category_id: '00000000-0000-0000-0000-000000000001', // Default category
          defaultprice: parseFloat(row.defaultprice || row['Price'] || 0),
          currentstock: parseInt(row.currentstock || row['Stock'] || 0),
          reorder_level: parseInt(row.reorder_level || row['Reorder Level'] || 10),
          minimumstocklevel: parseInt(row.minimumstocklevel || row['Min Stock'] || 5),
          is_active: true,
          expiry_tracking: false,
        };

        await insertItemMutation.mutateAsync(itemData);
      }
      
      message.success(`Successfully uploaded ${fileData.length} items`);
      setFileData([]);
      onSuccess();
    } catch (error) {
      console.error('Bulk upload error:', error);
      message.error('Failed to upload items');
    } finally {
      setUploading(false);
    }
  };

  const columns = [
    { title: 'Item Name', dataIndex: 'itemname', key: 'itemname' },
    { title: 'Product/Service', dataIndex: 'productservice', key: 'productservice' },
    { title: 'Unit', dataIndex: 'unitofmeasurement', key: 'unitofmeasurement' },
    { title: 'Price', dataIndex: 'defaultprice', key: 'defaultprice' },
    { title: 'Stock', dataIndex: 'currentstock', key: 'currentstock' },
  ];

  return (
    <Modal
      title="Bulk Upload Items"
      open={open}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button 
          key="upload" 
          type="primary" 
          onClick={handleBulkUpload}
          loading={uploading}
          disabled={fileData.length === 0}
        >
          Upload Items
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <Dragger
          beforeUpload={handleFileUpload}
          showUploadList={false}
          accept=".xlsx,.xls,.csv"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag Excel file to upload</p>
          <p className="ant-upload-hint">
            Support for Excel files (.xlsx, .xls) with columns: itemname, productservice, unitofmeasurement, defaultprice, currentstock
          </p>
        </Dragger>
      </div>

      {fileData.length > 0 && (
        <div>
          <h4>Preview ({fileData.length} items)</h4>
          <Table
            dataSource={fileData.slice(0, 5)}
            columns={columns}
            pagination={false}
            size="small"
            rowKey={(record, index) => index}
          />
          {fileData.length > 5 && (
            <p style={{ textAlign: 'center', marginTop: 8 }}>
              ... and {fileData.length - 5} more items
            </p>
          )}
        </div>
      )}
    </Modal>
  );
};

export default BulkUploadModal;
