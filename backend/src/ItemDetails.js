
const db = require('./db');
const updateLastSerialNumber = require('./getLastSerialNumber');

async function addPartsData(req, res){
  console.log('inside addParts', req.body);
  const {
    itemId,
    itemName,
    productService,
    buySellBoth,
    unitOfMeasurement,
    itemCategory,
    currentStock,
    defaultPrice,
    hsnCode,
    tax,
    minimumStockLevel,
    maximumStockLevel,
    drawingNumber,
    serialNumber,
    counterPartyCode,
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO itemmaster 
        (itemId,itemName, productService, buySellBoth, unitOfMeasurement, itemCategory, currentStock, defaultPrice, hsnCode, tax, minimumStockLevel, maximumStockLevel, drawingNumber, serialNumber, counterPartyCode) 
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
       RETURNING *`,
      [
        itemId,
        itemName,
        productService,
        buySellBoth,
        unitOfMeasurement,
        itemCategory,
        currentStock,
        defaultPrice,
        hsnCode,
        tax,
        minimumStockLevel,
        maximumStockLevel,
        drawingNumber,
        serialNumber,
        counterPartyCode,
      ]
    );
    console.log('items added successfully');
    await updateLastSerialNumber('SKU', itemId);
    res.status(200).json({
      message: 'Item added successfully',
      item: result.rows[0],
    });

    
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({
      message: 'Error adding item',
      error: error.message,
    });
  }
};

async function getAllItemData(req, res){
    try {
      console.log("inside get items function")
      const result = await db.query('SELECT * FROM itemMaster ORDER BY itemId ASC');
      //console.log(result.rows);
      res.status(200).json(result.rows);
      return result.rows;
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({
        message: 'Error fetching items',
        error: error.message,
      });
      return error
    }

}
async function getItem(req, res) {
  try {
      const sqlQuery = 'SELECT * FROM itemMaster where itemId = $1';
      const values = [req.params.id];
      console.log("inside get item");
      const item = await db.query(sqlQuery, values);
      res.status(200).json(item.rows);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
}


module.exports = {addPartsData, getAllItemData, getItem}


