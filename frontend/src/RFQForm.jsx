import React from 'react';
import { Layout, Button, Input, Select, Table, DatePicker, Upload, Form, Col, Row } from 'antd';
import { UploadOutlined, PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import './App.css'; // Import the CSS file

const { Header, Content } = Layout;
const { Option } = Select;

const ReqsuestQuotationForm = () => {
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'Item ID',
            dataIndex: 'itemId',
            key: 'itemId',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Item Description',
            dataIndex: 'itemDescription',
            key: 'itemDescription',
        },
        {
            title: 'HSN/SAC Code',
            dataIndex: 'hsnSacCode',
            key: 'hsnSacCode',
            render: () => <Select style={{ width: '100%' }} />,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text) => <Input defaultValue={text} />,
        },
        {
            title: 'Units',
            dataIndex: 'units',
            key: 'units',
            render: () => (
                <Select defaultValue="Nos" style={{ width: '100%' }}>
                    <Option value="Nos">Nos</Option>
                </Select>
            ),
        },
        {
            title: 'Delivery Date',
            dataIndex: 'deliveryDate',
            key: 'deliveryDate',
            render: () => <DatePicker style={{ width: '100%' }} />,
        },
    ];

    const dataSource = [
        {
            key: '1',
            itemId: 'YPE/SKU00500',
            itemDescription: 'S890QL 10.0mm x 1500 x 2500',
            quantity: '1',
        },
        {
            key: '2',
            itemId: 'YPE/SKU00501',
            itemDescription: 'S890QL 6.0mm x 1250 x 2500',
            quantity: '1',
        },
    ];

    return (
        <Layout>
            <Header className="suppliers-header">
                Suppliers
            </Header>
            <Content className="suppliers-content">
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Company Name" name="companyName">
                                <Input defaultValue="Amit Plast" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Company Reference ID" name="companyRefId">
                                <Select>
                                    <Option value="1">Reference ID</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Button type="primary" icon={<PlusOutlined />}>
                        Add Supplier
                    </Button>
                    <div className="table-actions">
                        <Button icon={<DownloadOutlined />} style={{ marginRight: '8px' }}>Download Item Template</Button>
                        <Button>Bulk Upload</Button>
                    </div>
                    <Table 
                        dataSource={dataSource} 
                        columns={columns} 
                        pagination={false} 
                        style={{ marginTop: '24px' }} 
                    />
                    <Button type="dashed" className="add-item-btn" icon={<PlusOutlined />}>Add Item</Button>
                    <div className="signature-section">
                        <Upload>
                            <Button icon={<UploadOutlined />}>Attach Signature</Button>
                        </Upload>
                    </div>
                    <div className="save-actions">
                        <Button type="default" htmlType="submit">Save Draft</Button>
                        <Button type="primary" htmlType="submit">Save and Send</Button>
                    </div>
                </Form>
            </Content>
        </Layout>
    );
};

export default ReqsuestQuotationForm;
