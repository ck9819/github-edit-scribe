import React, { useState } from 'react';
import { Table, Select, Button, Row, Col, Typography, Dropdown,Divider, Modal, Input } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import BuyerSelection from './buyerSelection';
import QuotationForm from './quotationForm';
import './App.css';

const { Option } = Select;
const { Text } = Typography;

const QuotationsPage = () => {
    const [isSelectionModalVisible, setisSelectionModalVisible] = useState(false)
    const [buyerName, setBuyerName] = useState(null);
    const [formtype, setFormtype] = useState("");
    const [dataSource, setDataSource] = useState([
    {
      key: '1',
      quotationNumber: 'YPE/QTN/24-25/0001',
      company: 'TATA Advanced Systems Limited',
      enquiryNumber: 'RFQ/TASL/SCM/GK/101532/068',
      totalAmount: '₹4,248.00',
      dealStatus: 'Pending',
      dealOwner: 'Apoorva',
      creationDate: '10/08/2024',
    },
    // Add more data as needed
  ]);

  const columns = [
    {
      title: 'QUOTATION NUMBER',
      dataIndex: 'quotationNumber',
      key: 'quotationNumber',
      render: (text) => <a href="#">{text}</a>,
    },
    {
      title: 'COMPANY',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'ENQUIRY NUMBER',
      dataIndex: 'enquiryNumber',
      key: 'enquiryNumber',
    },
    {
      title: 'TOTAL AMOUNT',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      align: 'right',
    },
    {
      title: 'OC CREATED',
      dataIndex: 'ocCreated',
      key: 'ocCreated',
      render: () => '-',
    },
    {
      title: 'DEAL STATUS',
      dataIndex: 'dealStatus',
      key: 'dealStatus',
      render: (status) => (
        <Button type="default" shape="round">
          {status}
        </Button>
      ),
    },
    {
      title: 'DEAL OWNER',
      dataIndex: 'dealOwner',
      key: 'dealOwner',
    },
    {
      title: 'CREATED BY',
      dataIndex: 'dealOwner',
      key: 'createdBy',
    },
    {
      title: 'CREATION DATE',
      dataIndex: 'creationDate',
      key: 'creationDate',
    },
  ];

  const items = [
    {
      key: '1',
      label: 'Sales Enquiry',
    },
    {
      key: '2',
      label: 'Sales Quotation',
    },
    {
        key: '3',
        label: 'Request for Quotation',
      },
      {
        key: '4',
        label: 'Order Confirmation',
      },
  ]
  const handleDropdownClick = ({ key }) => {
    console.log('inside onclick', key)
    setisSelectionModalVisible(true)
    if (key === '1') {
      setFormtype("SE")
      console.log('inside onclick', key)
    }
    else if (key === '2') {
       setFormtype("SQ")
      console.log('inside onclick', key)
    }
    else if(key === '3') {
        setFormtype("RFQ")
        console.log('inside onclick', key)
    }
    else if(key === '4') {
    setFormtype("OC")
    console.log('inside onclick', key)
}
}
const handleSelectBuyer = (name) => {
    setBuyerName(name);
};


  return (
    <div style={{ padding: '20px' }}>
      <Divider />
      <Row gutter={16} style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Col span={24} style={{ textAlign: 'right' }}>
          <h2>Quotations</h2>
        </Col>
        </Row>
      <Row gutter={16}>
        <Col span={6}>
          <Select defaultValue="SQ" style={{ width: '100%' }}>
            <Option value="SQ">SQ</Option>
            <Option value="SE">SE</Option>
            <Option value="RFQ">RFQ</Option>
          </Select>
        </Col>
        <Col span={6}>
          <Select defaultValue="Sent" style={{ width: '100%' }}>
            <Option value="Sent">Sent</Option>
            <Option value="Received">Received</Option>
            <Option value="Draft">Draft</Option>
          </Select>
        </Col>
        <Col span={6}>
          <Select defaultValue="Pending" style={{ width: '100%' }}>
            <Option value="Pending">Pending</Option>
            <Option value="Lost">Lost</Option>
            <Option value="Won">Won</Option>
            <Option value="Cancelled">Cancelled</Option>
            <Option value="All">All</Option>
          </Select>
        </Col>
        <Col span={6}>
          <Select placeholder="Tags" style={{ width: '100%' }}></Select>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Dropdown
              menu={{
                items,
                onClick: handleDropdownClick
              }}
            >
            <Button type="primary" icon={<PlusOutlined />}>
              CREATE DOCUMENT <DownOutlined />
            </Button>
          </Dropdown>
          {
            isSelectionModalVisible & !buyerName ?(<BuyerSelection formtype={formtype} onSelectBuyer={handleSelectBuyer}/>)
            : null
          }
        </Col>
      </Row>
      <Table
        className='sales-table'
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        bordered
      />
      
    </div>
  );
};

export default QuotationsPage;
