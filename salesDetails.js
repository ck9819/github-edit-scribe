const db = require('./db');
const updateLastSerialNumber = require('./getLastSerialNumber');

async function addSalesData(req, res){
  const {
    enquiry_id,
    supplier_details,
    buyer_details,
    delivery_location,
    place_of_supply,
    primary_document_details,
    items,
    email_recipients,
    total_before_tax,
    total_tax,
    total_after_tax,
    quotation_id,
    order_id,
    PO_id,
    deal_owner,
    deal_status,
    created_by
} = req.body;

try {
    const newSale = await db.query(
        `INSERT INTO sales (enquiry_id, supplier_details, buyer_details, delivery_location, place_of_supply, 
         primary_document_details, items, email_recipients, total_before_tax, total_tax, total_after_tax, 
         quotation_id, order_id, PO_id, deal_owner, deal_status, created_by) 
         VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
        [enquiry_id, supplier_details, buyer_details, delivery_location, place_of_supply,
        primary_document_details, items, email_recipients, total_before_tax, total_tax,
        total_after_tax, quotation_id, order_id, PO_id, deal_owner, deal_status, created_by]
    );
    res.json(newSale.rows[0]);
} catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
}
}

async function getAllSalesData(req, res) {
    try {
    const sql = 'SELECT * FROM Sales';
    db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results.rows);
    });
 } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

async function getSales(req, res) {
    const id  = req.body.id;
    console.log(req.body.id);
    try{
    const sql = 'SELECT * FROM Sales WHERE enquiry_id = $1';
    const result = await db.query(sql, [id]);
    console.log(result.rows[0]);
    res.json(result.rows[0]);
    }
    catch(err){
      console.error(err.message);
        res.status(500).json({ error: err.message });
    }

}
async function getquotation(req,res){
  const { quotation_id } = req.params;

    try {
        const sales = await db.query(`SELECT * FROM sales WHERE quotation_id = $1`, [quotation_id]);
        res.json(sales.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
}

async function updateSales(req, res) {
  const { id } = req.params;
  const {
    Company, CustomerEnquiryNumber, CustomerEnquiryDate, SqCreated, SalesQuotationNo,
    TotalItems, TotalValues, TotalAmount, OCCreated, DealStatus, DealOwner,
    NextActionDate, Tags, CreatedBy
  } = req.body;

  const sql = `
    UPDATE Sales SET 
    Company = $1, CustomerEnquiryNumber = $2, CustomerEnquiryDate = $3, SqCreated = $4, SalesQuotationNo = $5, 
    TotalItems = $6, TotalValues = $7, TotalAmount = $8, OCCreated = $9, DealStatus = $10, DealOwner = $11, 
    NextActionDate = $12, Tags = $13, CreatedBy = $14
    WHERE SalesEnquiryNo = $15
  `;

  const values = [
    Company, CustomerEnquiryNumber, CustomerEnquiryDate, SqCreated, SalesQuotationNo,
    TotalItems, TotalValues, TotalAmount, OCCreated, DealStatus, DealOwner,
    NextActionDate, Tags, CreatedBy, id
  ];

  try {
    await db.query(sql, values);
    res.send('Sales entry updated successfully.');
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
}

async function updateQuotationForm(req, res) {
  console.log("updateQuotationForm", req.body);
  const { primary_document_details, enquiry_id, quotation_id, quotation_date, SqCreated } = req.body;

  const sql = `
    UPDATE Sales SET 
    primary_document_details = $1, quotation_id = $2, quotation_date = $3, SqCreated = $4
    WHERE enquiry_id = $5
  `;

  const values = [
    primary_document_details, quotation_id, quotation_date, SqCreated, enquiry_id
  ];

  try {
    await db.query(sql, values);
    res.json({ message: 'Sales updated successfully' });
  } catch (error) {
    console.error('Failed to update sales:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function updateOrderForm(req, res) {
  const {
    primary_document_details, 
    OcCreated,
    order_id,
    order_date,
    PO_id,
    PO_date,
    deal_status,
    quotation_id
  } = req.body;

  const sql = `
    UPDATE Sales SET 
    primary_document_details = $1, OcCreated = $2, order_id = $3, order_date = $4, PO_id = $5, PO_date = $6, 
    deal_status = $7
    WHERE quotation_id = $8
  `;

  const values = [
    primary_document_details, OcCreated, order_id, order_date, PO_id, PO_date, deal_status, quotation_id
  ];

  try {
    await db.query(sql, values);
    res.json({ message: 'Sales updated successfully' });
  } catch (error) {
    console.error('Failed to update sales:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {addSalesData, getAllSalesData, getSales, updateSales, updateQuotationForm, updateOrderForm, getquotation}