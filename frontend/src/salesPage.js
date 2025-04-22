import React, { useState } from 'react'
import { Button, Dropdown, Row, Col, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PartForm from './partForm'
import CompanyForm from './companyForm'

const SalesPage = () => {
  const [isPartModalVisible, setIsPartModalVisible] = useState(false)
  const [isCompanyModalVisible, setIsCompanyModalVisible] = useState(false)

  const items = [
    {
      key: '1',
      label: 'Add Company',
    },
    {
      key: '2',
      label: 'Add Parts',
    },
  ]

  const handlePartCancel = () => {
    setIsPartModalVisible(false)
  }

  const handleCompanyCancel = () => {
    setIsCompanyModalVisible(false)
  }

  const handleDropdownClick = ({ key }) => {
    console.log('inside onclick', key)
    if (key === '1') {
      setIsCompanyModalVisible(true)
      setIsPartModalVisible(false)
    }
    if (key === '2') {
      setIsCompanyModalVisible(false)
      setIsPartModalVisible(true)
    }
  }
  return (
    <div>
      <Row gutter={16} style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Col span={12} style={{ textAlign: 'right' }}>
          <h2>Sales & Purchase</h2>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Dropdown
            menu={{
              items,
              onClick: handleDropdownClick,
            }}
            placement="topRight"
          >
            <Button type="primary" icon={<PlusOutlined />}>
              Create Document
            </Button>
          </Dropdown>
        </Col>
      </Row>
      <Modal
        title="Add Part Details"
        open={isPartModalVisible}
        onCancel={handlePartCancel}
        width={'60vw'}
      >
        <PartForm />
      </Modal>
      <Modal
        title="Add Company Details"
        open={isCompanyModalVisible}
        footer={null}
        width={'60vw'}
        onCancel={handleCompanyCancel}
      >
        <CompanyForm />
      </Modal>
    </div>
  )
}

export default SalesPage
