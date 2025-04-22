import React, { useState, useEffect } from 'react';
import { Modal, Select, Button } from 'antd';
import QuotationForm from './quotationForm';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Option } = Select;

const BuyerSelection = (props) => {
    console.log("inside buyer selection",props);
    const formtype = props.formtype
    const navigate = useNavigate();
    const [visible, setVisible] = useState(true);
    const [isQuotationFormVisible, setIsQuotationFormVisible] = useState(false);
    const [selectedBuyer, setSelectedBuyer] = useState(null);
    const [buyers, setBuyers] = useState([]); 

    useEffect(() => {
       
            fetchBuyerDetails();
        }, []);

     const fetchBuyerDetails = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getAllCompanyies/'); // Replace with your actual API endpoint
            setBuyers(response.data);
            console.log(response.data);
          } catch (error) {
            console.error('Error fetching items:', error);
          }
        };

    const handleBuyerChange = (value) => {
        setSelectedBuyer(value);
    };

    const handleOk = () => {
        setVisible(false);
        //setIsQuotationFormVisible(true);
        if(formtype === 'SE'){
            navigate('/enquiry', { state: { buyerName: selectedBuyer } });
        }
        if(formtype === 'SQ'){
            navigate('/quotation', { state: { buyerName: selectedBuyer } });
        }
        if(formtype === 'RFQ'){
            navigate('/requestForquotation', { state: { buyerName: selectedBuyer } });    
        }
        if(formtype === 'OC'){
            navigate('/orderConfirmation', { state: { buyerName: selectedBuyer } });
        }
    };

    return (
        <>
            <Modal
                title="Please Add/Select Buyer"
                visible={visible}
                onOk={handleOk}
                onCancel={() => setVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setVisible(false)}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk} disabled={!selectedBuyer}>
                        Select Buyer
                    </Button>
                ]}
            >
                <Select
                    showSearch
                    placeholder="Select Buyer"
                    optionFilterProp="children"
                    onChange={handleBuyerChange}
                    style={{ width: '100%' }}
                >
                    {buyers.map(item => (
                      <Option
                        key={item.buyername}
                        value={item.buyername}
                        scroll={{ x: "max-content" }}
                      >
                        {item.buyername}
                      </Option>
                    ))}
                    <Option value="SCHENCK PROCESS INDIA LIMITED">SCHENCK PROCESS INDIA LIMITED</Option>
                    <Option value="Apoorva">Apoorva</Option>
                    {/* Add more options here */}
                </Select>
                <Button type="link" style={{ marginTop: '10px' }}>
                    + Add New Company
                </Button>
            </Modal>

            {/* Render QuotationForm if isQuotationFormVisible is true
            {isQuotationFormVisible && <QuotationForm buyerName={selectedBuyer} />} */}
        </>
    );
};

export default BuyerSelection;
