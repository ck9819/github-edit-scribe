
import React from 'react';
import { Table, Tag, Button, Space } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import { useSalesEnquiries } from '../store/hooks/supabaseHooks';

const SalesEnquiryList = () => {
  const { data: salesEnquiries = [], isLoading, error } = useSalesEnquiries();

  const columns = [
    {
      title: 'Enquiry ID',
      dataIndex: 'enquiry_id',
      key: 'enquiry_id',
      width: 150,
    },
    {
      title: 'Buyer',
      dataIndex: 'buyer_details',
      key: 'buyer',
      render: (buyer_details) => buyer_details?.name || 'N/A',
    },
    {
      title: 'Deal Owner',
      dataIndex: 'deal_owner',
      key: 'deal_owner',
    },
    {
      title: 'Status',
      dataIndex: 'deal_status',
      key: 'deal_status',
      render: (status) => {
        const color = status === 'Pending' ? 'orange' : 
                     status === 'Approved' ? 'green' : 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Created Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => console.log('View:', record.id)}
          >
            View
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => console.log('Edit:', record.id)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  if (error) {
    return <div>Error loading sales enquiries</div>;
  }

  return (
    <Table
      columns={columns}
      dataSource={salesEnquiries}
      rowKey="id"
      loading={isLoading}
      pagination={{ pageSize: 10 }}
      scroll={{ x: true }}
    />
  );
};

export default SalesEnquiryList;
