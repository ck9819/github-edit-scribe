//import { Client } from 'pg';
const {Client} = require('pg');
const db = new Client({
	user: 'postgres',
	password: 'root123',
	host: 'localhost',
	port: '5432',
	database: 'postgres',
});
db.connect(err => {
	if (err) {
	  throw err;
	}
	console.log('db connected...');
  });

module.exports = db;