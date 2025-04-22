import React, { useState, useEffect } from 'react';
import { Modal, Select, Button } from 'antd';
//import QuotationForm from './quotationForm';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanies} from '../store/slices/companySlice'

const { Option } = Select;

const BuyerSelection = () => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(true);
    const [selectedBuyer, setSelectedBuyer] = useState(null);
    const dispatch = useDispatch();
    const { loading, companies=[], error } = useSelector((state) => state.companyData);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);
  console.log('companies:', companies);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;


    const handleBuyerChange = (value) => {
        setSelectedBuyer(value);
    };

    const handleOk = () => {
        setVisible(false);
        navigate('/enquiry', { state: { buyerName: selectedBuyer } });
    };

    return (
        <>
            <Modal
                title="Please Add/Select Buyer"
                open={visible}
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
                    {companies.map(item => (
                      <Option
                        key={item.buyername}
                        value={item.buyername}
                        scroll={{ x: "max-content" }}
                      >
                        {item.buyername}
                      </Option>
                    ))}
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
