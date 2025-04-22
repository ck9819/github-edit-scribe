import React, { useState } from 'react';
import { Card, Modal, Button, List, Input, Form, Select, Typography } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { TextArea } = Input;

const TermsAndConditions = () => {
  const [terms, setTerms] = useState([
    { id: 1, title: 'Payment Terms', description: 'Payment terms (Against PI/Against Delivery/30 Days/45Days/60Days)' },
    { id: 2, title: 'Delivery', description: '16 weeks from the date of receipt of PO, FIM, CC whichever is later.' },
    // Add more terms here
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTerm, setEditingTerm] = useState(null);

  const handleEdit = (item) => {
    setEditingTerm(item);
    setIsEditModalVisible(true);
  };

  const handleSave = (values) => {
    setTerms((prev) => 
      prev.map((term) => (term.id === editingTerm.id ? { ...term, ...values } : term))
    );
    setIsEditModalVisible(false);
  };

  return (
    <div>
      <Card title="Terms & Conditions" extra={<Button icon={<EditOutlined />} onClick={() => setIsModalVisible(true)} />}>
        <List
          size="small"
          dataSource={terms}
          renderItem={(item) => (
            <List.Item>
              <Text strong>{item.title}</Text>: {item.description}
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title="Terms & Conditions"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <List
          itemLayout="horizontal"
          dataSource={terms}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(item)}
                />
              ]}
            >
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          style={{ marginTop: 16 }}
          block
          onClick={() => {
            setEditingTerm({ id: terms.length + 1, title: '', description: '' });
            setIsEditModalVisible(true);
          }}
        >
          Add New Term
        </Button>
      </Modal>

      <Modal
        title="Edit Term"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={editingTerm}
          onFinish={handleSave}
          layout="vertical"
        >
          <Form.Item
            label="T&C heading"
            name="title"
            rules={[{ required: true, message: 'Please enter the term heading' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter the description' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default TermsAndConditions;
