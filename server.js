// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const {GeneratePdf} = require('./pdfGenerater');
const {addCompanyData, getAllCompanyData, getCompany} = require('./CompanyData');
const {addPartsData, getAllItemData, getItem} = require('./ItemDetails');
const {getNextSerialNumber, generateItemId} = require('./generateSerialNumber');
const {addSalesData, getAllSalesData, getSales, getquotation, updateQuotationForm, updateOrderForm} = require('./salesDetails');
const {login, authenticateToken} = require('./login');
const app = express();
const PORT = 5000;
const SECRET_KEY = 'your_secret_key';
const db = require('./db');

app.use(bodyParser.json());
app.use(cors());

// Dummy user for demonstration
const user = {
  email: 'user@example.com',
  password: bcrypt.hashSync('password123', 8) // Hash the password
};


app.post('/login', async(req, res) => {
  const { email, password } = req.body;
  const result = await login(req,res);
    return {
      result
    }


  // if (email !== user.email) {
  //   return res.status(401).json({ message: 'Invalid email' });
  // }

  // const passwordIsValid = bcrypt.compareSync(password, user.password);
  // if (!passwordIsValid) {
  //   return res.status(401).json({ message: 'Invalid password' });
  // }

  // const token = jwt.sign({ id: email }, SECRET_KEY, { expiresIn: 86400 }); // 24 hours

  // res.status(200).json({
  //   message: 'Login successful',
  //   token
  // });
});

app.post('/authenticateToken', async(req, res)=>{
  const result = await authenticateToken(req,res);
  return {
    result
  }
});

app.post('/send-pdf', async(req, res)=>{
    const result = await GeneratePdf(req,res);
    return {
      result
    }
});
app.post('/addCompanyData', async(req, res)=>{
    const result = await addCompanyData(req,res);
    return {
      result
    }
});
app.get('/getAllCompanyies', async(req, res)=>{
    const result = await getAllCompanyData(req,res);
    return {
      result
    }
});
app.post('/addItem', async (req, res) => {
    const result = await addPartsData(req,res);
    return {
      result
    }
});
app.get('/getAllItems', async (req, res) => {
    const result = await getAllItemData(req,res);
    return {
      result
    }
});
app.get('/getItem', async (req, res) => {
    const result = await getItem(req,res);
    return {
      result
    }
});
app.get('/getCompany/:buyerName', async (req, res) => {
    const result = await getCompany(req,res);
    return {
      result
    }
});
app.post('/getNextSerialNumber', async (req, res) => {
    const result = await getNextSerialNumber(req,res);
    return {
      result
    }
});

app.post('/getitemid', async (req, res) => {
  const result = await generateItemId(req,res);
  return {
    result
  }
});

app.post('/addsales', async (req, res) => {
  const result = await addSalesData(req,res);
  return {
    result
  }
});
app.get('/getallsales', async (req, res) => {
  const result = await getAllSalesData(req,res);
  return {
    result
  }
});
app.post('/getsales', async (req, res) => {
  const result = await getSales(req,res);
  return {
    result
  }
});
app.post('/getquotation', async (req, res) => {
  const result = await getquotation(req,res);
  return {
    result
  }
});


app.post('/updatequtation', async (req, res) => {
  const result = await updateQuotationForm(req,res);
  return {
    result
  }
});
app.post('/updateorderdata', async (req, res) => {
  const result = await updateOrderForm(req,res);
  return {
    result
  }
});
app.post('/calculate', (req, res) => {
    const { price, taxRate } = req.body;
    const tax = price * (taxRate / 100);
    const total = price + tax;
    res.json({ tax, total });
});

app.post('/generate-pdf', (req, res) => {
    const html = req.body.htmlContent;
    pdf.create(html).toStream((err, stream) => {
        if (err) return res.sendStatus(500);
        res.type('pdf');
        stream.pipe(res);
    });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});