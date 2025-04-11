
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret'; // You should keep this secret and safe
const db = require('./db');

// Endpoint for user login
 async function login(req, res) {
    console.log("inside login", req.body)
  const { username, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    console.log("inside login", result.rows)
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const user = result.rows[0];
   // const isMatch = await bcrypt.compare(password, user.password);

    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Middleware to authenticate using JWT
async function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};

// // Endpoint to protect some route
// app.get('/api/protected', authenticateToken, (req, res) => {
//   res.json({ message: `Hello ${req.user.username}, you are authenticated` });
// });


module.exports = {login, authenticateToken}