import React, { useState, useEffect } from 'react';
import { Modal, Select, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSalesEnquiry } from '../store/slices/salesSlice';

const { Option } = Select;

const QuotationNumSelection = () => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(true);
    const [quotationNumber, setEnquiryNumber] = useState(null);
    const dispatch = useDispatch();
    const { enquiry, loading, error } = useSelector((state) => state.sales);
  
    useEffect(() => {
      dispatch(fetchAllSalesEnquiry());
    }, [dispatch]);
  
    if (loading) {
      //return <Spin />;
    }
  
    if (error) {
     // return <Alert message={error.message} type="error" showIcon />;
    }
  
    const handleNumChange = (value) => {
        setEnquiryNumber(value);
    };

    const handleOk = () => {
        setVisible(false);
        navigate('/orderConfirmation', { state: { quotationNumber: quotationNumber } });
    };

    return (
        <>
            <Modal
                title="Select quotation Number"
                open={visible}
                onOk={handleOk}
                onCancel={() => setVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setVisible(false)}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                       Ok
                    </Button>
                ]}
            >
               <Select
                    showSearch
                    placeholder="Select quotation Number"
                    optionFilterProp="children"
                    onChange={handleNumChange}
                    style={{ width: '100%' }}
                >
                    {enquiry.map(item => (
                      <Option
                        key={item.enquier_id}
                        value={item.enquier_id}
                        scroll={{ x: "max-content" }}
                      >
                        {item.enquier_id}
                      </Option>
                    ))}
                      
                </Select>
               
            </Modal>
            {/* Render QuotationForm if isQuotationFormVisible is true
            {isQuotationFormVisible && <QuotationForm buyerName={selectedBuyer} />} */}
        </>
    );
};

export default QuotationNumSelection;
