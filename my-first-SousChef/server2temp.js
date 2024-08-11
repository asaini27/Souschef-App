const db = require('./database1'); 
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // If you're using bcrypt for password hashing
const { spawn } = require('child_process');
const WebSocket = require('ws');
const http = require('http');

const app = express();
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let pythonProcess = spawn('python', ['./testai3.py']);

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    pythonProcess.stdin.write(message + '\n');
  });

  pythonProcess.stdout.on('data', (data) => {
    console.log(`Python output: ${data}`);
    ws.send(data.toString());  // Send data back to the client
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// User registration endpoint
app.post('/register', async (req, res) => {
  try {
    const { username, email, password, food_allergies } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO user (username, email, password, food_allergies) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, food_allergies],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ message: "Error registering user" });
        }
        res.status(201).send({ message: "User registered successfully" });
      });
  } catch (error) {
    res.status(500).send({ message: "Error registering user" });
  }
});

// User login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM user WHERE username = ?', [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).send({ message: "Invalid credentials" });
    }
    const user = results[0];
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user.user_id }, 'SOUS248');
      res.json({ token });
    } else {
      res.status(401).send({ message: "Invalid credentials" });
    }
  });
});

// Middleware for JWT authentication
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'SOUS248', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Example protected route
app.get('/protected-route', authenticateToken, (req, res) => {
  res.send("Access to protected route successful");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


