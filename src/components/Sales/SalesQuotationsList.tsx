
import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, message } from 'antd';
import { EyeOutlined, MailOutlined, PlusOutlined } from '@ant-design/icons';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import dayjs from 'dayjs';
import QuotationForm from './QuotationForm';

const SalesQuotationsList = () => {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  // Mock data for now - in real implementation, fetch from database
  const quotations = [
    {
      id: 1,
      quotationNumber: 'YPE/QTN/2024-25/0001',
      customerName: 'TATA Advanced Systems Limited',
      customerEmail: 'procurement@tata.com',
      totalAmount: 578200.00,
      status: 'SENT',
      createdDate: '2024-01-18',
      validUntil: '2024-02-17',
    },
    // Add more mock data as needed
  ];

  const columns = [
    {
      title: 'Quotation Number',
      dataIndex: 'quotationNumber',
      key: 'quotationNumber',
      render: (text: string) => <a href="#">{text}</a>,
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `₹${amount.toLocaleString()}`,
      align: 'right' as const,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          DRAFT: 'orange',
          SENT: 'blue',
          ACCEPTED: 'green',
          REJECTED: 'red',
          EXPIRED: 'gray',
        };
        return <Tag color={colors[status as keyof typeof colors]}>{status}</Tag>;
      },
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Valid Until',
      dataIndex: 'validUntil',
      key: 'validUntil',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewQuotation(record)}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<MailOutlined />}
            onClick={() => handleResendQuotation(record)}
          >
            Resend
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewQuotation = (quotation: any) => {
    setSelectedQuotation(quotation);
    // Implement view functionality
    message.info('View quotation functionality will be implemented');
  };

  const handleResendQuotation = (quotation: any) => {
    // Implement resend functionality
    message.info('Resend quotation functionality will be implemented');
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Sales Quotations</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateModalVisible(true)}
        >
          Create Quotation
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={quotations}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Create Quotation"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: '1400px' }}
      >
        <QuotationForm />
      </Modal>
    </div>
  );
};

export default SalesQuotationsList;
