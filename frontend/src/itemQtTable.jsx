import React, { useState } from 'react';
import { Form, Input, Button, Select, InputNumber, Table } from 'antd';

const { Option } = Select;

const ItemTable = ({ buyerId }) => {
    const [items, setItems] = useState([]);
    const [itemDescription, setItemDescription] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [hsnCode, setHsnCode] = useState('');
    const [total, setTotal] = useState(0);
    const [units,setUnits] = useState(null);
    const[totalBeforeTax,setTotalBeforeTax] = useState(0);
    const [tax,setTax] = useState(0);
    const [remarks,setRemarks] = useState(0);

    const addItem = () => {
        const newItem = {
            key: items.length + 1,
            description: itemDescription,
            hsnCode,
            quantity,
            price,
            total: quantity * price,
        };
        setItems([...items, newItem]);
        setTotal(total + newItem.total);
        // Reset input fields after adding the item
        setItemDescription('');
        setQuantity(0);
        setPrice(0);
        setHsnCode('');
    };

    const columns = [
        {
            title: 'Item ID',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Item Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'HSN/SAC Code',
            dataIndex: 'hsnCode',
            key: 'hsnCode',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Units',
            dataIndex: 'units',
            key: 'units',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Tax',
            dataIndex: 'tax',
            key: 'tax',
        },
        {
            title: 'Total Before Tax',
            dataIndex: 'totalbeforetax',
            key: 'totalbeforetax',
        },
    ];

    return (
        <Form layout="vertical">
            <Form.Item label="Item ID">
                <Select
                    value={itemDescription}
                    onChange={(value) => setItemDescription(value)}
                    placeholder="Select an item"
                >
                    <Option value="Item 1">Item 1</Option>
                    <Option value="Item 2">Item 2</Option>
                    <Option value="Item 3">Item 3</Option>
                    {/* Add more items here */}
                </Select>
            </Form.Item>
            <Form.Item label="Item Description">
                <Select
                    value={itemDescription}
                    onChange={(value) => setItemDescription(value)}
                    placeholder="Select an item"
                >
                    <Option value="Item 1">Item 1</Option>
                    <Option value="Item 2">Item 2</Option>
                    <Option value="Item 3">Item 3</Option>
                    {/* Add more items here */}
                </Select>
            </Form.Item>

            <Form.Item label="HSN/SAC Code">
                <Input
                    value={hsnCode}
                    onChange={(e) => setHsnCode(e.target.value)}
                    placeholder="Enter HSN/SAC Code"
                />
            </Form.Item>

            <Form.Item label="Quantity">
                <InputNumber
                    value={quantity}
                    onChange={(value) => setQuantity(value)}
                    placeholder="Enter quantity"
                    style={{ width: '100%' }}
                />
            </Form.Item>
            <Form.Item label="Units">
                <InputNumber
                    value={quantity}
                    onChange={(value) => setUnits(value)}
                    placeholder="Enter units"
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item label="Price">
                <InputNumber
                    value={price}
                    onChange={(value) => setPrice(value)}
                    placeholder="Enter price"
                    style={{ width: '100%' }}
                />
            </Form.Item>
            <Form.Item label="Tax">
                <InputNumber
                    value={price}
                    onChange={(value) => setTax(value)}
                    placeholder="Enter Tax"
                    style={{ width: '100%' }}
                />
            </Form.Item>
            <Form.Item label="Total Before Tax">
                <InputNumber
                    value={price}
                    onChange={(value) => setTotalBeforeTax(value)}
                    placeholder="Enter Tax"
                    style={{ width: '100%' }}
                />
            </Form.Item>
            <Form.Item label="Remarks">
                <Input
                    value={hsnCode}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter Remarks"
                />
            </Form.Item>


            <Button type="primary" onClick={addItem}>
                + Add Item
            </Button>

            <Table
                dataSource={items}
                columns={columns}
                pagination={false}
                summary={() => (
                    <Table.Summary.Row>
                        <Table.Summary.Cell colSpan={4}>Total</Table.Summary.Cell>
                        <Table.Summary.Cell>{total}</Table.Summary.Cell>
                    </Table.Summary.Row>
                )}
            />
        </Form>
    );
};

export default ItemTable;
