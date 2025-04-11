const fs = require('fs');
const path = require('path');
const db = require('./db');

// Path to the file where the last number will be stored
//const lastNumberFile = path.join(__dirname, 'lastNumber.json');

// Load the last number from file
function loadLastNumber(filepath) {
  // Ensure the directory exists
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Check if the file exists
  if (fs.existsSync(filepath)) {
    const data = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(data).lastNumber;
  } else {
    return 0; // Start with 0 if file does not exist
  }
}

// Save the last number to file
function saveLastNumber(lastNumber, lastNumberFile) {
  const data = JSON.stringify({ lastNumber });
  fs.writeFileSync(lastNumberFile, data, 'utf8');
}

// Function to get the last serial number for a given form type
async function getLastSerialNumber(formType) {
  const query = 'SELECT last_number FROM serial_numbers WHERE form_type = $1';
  const result = await db.query(query, [formType]);

  if (result.rows.length > 0) {
    return result.rows[0].last_number;
  } else {
    // If no record exists, initialize it with 0 and insert a new record
    await pool.query('INSERT INTO serial_numbers (form_type, last_number) VALUES ($1, 0)', [formType]);
    return 0;
  }
}

// Function to update the last serial number for a given form type
export async function updateLastSerialNumber(formType, newNumber) {
  const query = 'UPDATE serial_numbers SET last_number = $1 WHERE form_type = $2';
  await db.query(query, [newNumber, formType]);
}


function generateSerialNumber(prefix, startYear, endYear, lastNumber) {
    // Increment the last number
    const newNumber = parseInt(lastNumber) + 1;
  
    // Pad the number with leading zeros to ensure it's 5 digits long
    const paddedNumber = String(newNumber).padStart(5, '0');
  
    // Construct the serial number
    const serialNumber = `${prefix}/${startYear}-${endYear}/${paddedNumber}`;
  
    return { serialNumber, newNumber };
  }

// Get the next serial number
async function getNextSerialNumber(req, res) {
  console.log('getNextSerialNumber', req.body);
  const {prefix, startYear, endYear} = req.body;
  
  // Split the string using '/'
  const splitString = prefix.split('/')[1];
  console.log(splitString);
  // var lastNumberFile = "";
  // if(splitString) {
  //   if(splitString === 'SE'){
  //     lastNumberFile = path.join(__dirname, 'lastSENumber.json');

  //   }
  //   else if(splitString === 'QTN'){
  //     lastNumberFile = path.join(__dirname, 'lastNumber.json');
  //   }
  //   else if(splitString === 'OC'){
  //     lastNumberFile = path.join(__dirname, 'lastOCNumber.json');
  //   }
  //   else if(splitString === 'SKU'){
  //     lastNumberFile = path.join(__dirname, 'lastItemNumber.json');
  //   }
// }
  // console.log("lastNumberFile",lastNumberFile);
  //   const lastNumber = loadLastNumber(lastNumberFile);
  //   console.log(typeof(lastNumber));

  const lastNumber = await getLastSerialNumber(splitString);

  const { serialNumber, newNumber } = generateSerialNumber(prefix, startYear, endYear, lastNumber);
  //const newobj = {lastQTNumber: newNumber}

  // Update the last generated number
  await updateLastSerialNumber(splitString, newNumber);
  //saveLastNumber(newNumber,lastNumberFile);
  res.status(200).json(serialNumber);
  return serialNumber;
}

async function generateItemId(req, res) {
  const lastNumberFile = path.join(__dirname, 'lastItemNumber.json');
    console.log('getNextSerialNumber', req.body);
    const {prefix} = req.body;
    const lastNumber = await getLastSerialNumber(prefix);
   // const lastNumber = loadLastNumber(lastNumberFile);
    console.log(typeof(lastNumber));

    const newNumber = parseInt(lastNumber) + 1;
  
    // Pad the number with leading zeros to ensure it's 5 digits long
    const paddedNumber = String(newNumber).padStart(5, '0');
  
    // Construct the serial number
    const serialNumber = `${prefix}/${paddedNumber}`;

  // Update the last generated number
  await updateLastSerialNumber(prefix, newNumber);
  //saveLastNumber(newNumber, lastNumberFile);
  res.status(200).json(serialNumber);
  return serialNumber;

  
}

module.exports = {getNextSerialNumber, generateItemId}


