const db = require('./db');

async function addCompanyData(req, res){
    const {
        buyerName,
        buyerEmail,
        buyerGst,
        buyerAddress,
        buyerContact,
        deliveryAddress,
        sameAsBuyerAddress

    } = req.body;

   try{
    // Check if the buyer name already exists
    const queryCheck = 'SELECT * FROM company WHERE buyerName = $1';
    const result = await db.query(queryCheck, [buyerName]);

    if (result.rows.length > 0) {
      // Buyer name exists
      return res.status(400).json({ message: 'Buyer name already exists' });
    }
		const insert =
			'INSERT INTO company(buyerName,buyerEmail,buyerGst,buyerContact,deliveryAddress,sameAsBuyerAddress,buyerAddress) values($1, $2, $3,$4,$5,$6,$7) RETURNING *';
		const values = [buyerName,
            buyerEmail,
            buyerGst,
            buyerContact,
            deliveryAddress,
            sameAsBuyerAddress,
            buyerAddress];

            const newCompany = await db.query(insert, values)
			console.log('Data inserted successfully');      
            res.status(200).send('data stored successfully!');
	}
	catch(err)  {
		console.error('Error connecting to PostgreSQL database', err);
        res.status(500).send('Error connecting to PostgreSQL database');
    }

};

async function getAllCompanyData(req, res){
    try {
        console.log("inside gettall company");
        const allCompanies = await db.query('SELECT * FROM company');
        res.status(200).json(allCompanies.rows);

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }

}

async function getCompany(req, res) {
    const data = [req.params.buyerName];
    try {
        const sqlQuery = 'SELECT * FROM company where buyerName = $1';
        
        console.log("inside gettall company", data);
        const company = await db.query(sqlQuery, data);
        res.status(200).json(company.rows[0]);

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
}

module.exports = {addCompanyData, getAllCompanyData, getCompany}



