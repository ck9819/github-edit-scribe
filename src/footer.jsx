
import React from 'react';
import { Layout, Row, Col } from 'antd';
import { supplierDetails } from './constants';

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer className="footer-container">
      <div className="footer-content">
        <Row gutter={16}>
          <Col xs={24} sm={12} className="footer-contact">
            <span>{supplierDetails.name} © 2024</span>
          </Col>
          <Col xs={24} sm={12} className="footer-copyright">
            <span>Powered by Advanced Technology Solutions</span>
          </Col>
        </Row>
      </div>
    </Footer>
  );
};

export default AppFooter;
