
import React from 'react';
import { Row, Col, Typography, Space, Divider } from 'antd';
import { supplierDetails } from './constants';
import './App.css';

const { Text, Link } = Typography;

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <div className="footer-container">
            <Divider style={{ margin: '12px 0' }} />
            <Row gutter={[16, 16]} justify="space-between" align="middle" className="footer-content">
                <Col xs={24} sm={12} md={8}>
                    <Space direction="vertical" size={0}>
                        <Text strong>{supplierDetails.name}</Text>
                        <Text>{supplierDetails.address}</Text>
                    </Space>
                </Col>
                
                <Col xs={24} sm={12} md={8} className="footer-contact">
                    <Space direction="vertical" size={0}>
                        <Text>Contact: {supplierDetails.Contact}</Text>
                        <Text>GSTIN: {supplierDetails.GSTIN}</Text>
                    </Space>
                </Col>
                
                <Col xs={24} md={8} className="footer-copyright">
                    <Text>© {currentYear} {supplierDetails.name}. All rights reserved.</Text>
                </Col>
            </Row>
        </div>
    );
}

export default Footer;
