const db = require('./database1');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { exec } = require('child_process');
const http = require('http');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(bodyParser.json());

const server = http.createServer(app);

let pythonProcess = null;

function startPythonProcess(userId) {
  if (pythonProcess) {
    pythonProcess.kill();
  }

  pythonProcess = exec(`python3 ./testGemini-1.py ${userId}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
}

app.post('/start-ai', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  if (!pythonProcess) {
    startPythonProcess(userId);
    res.status(200).send({ message: 'Press to stop' });
  } else {
    res.status(400).send({ message: 'AI model already running' });
  }
});

app.post('/stop-ai', (req, res) => {
  if (pythonProcess) {
    pythonProcess.kill();
    pythonProcess = null;
    res.status(200).send({ message: 'AI model stopped' });
  } else {
    res.status(400).send({ message: 'AI model is not running' });
  }
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

// Save preferences endpoint
app.post('/save-preferences', authenticateToken, (req, res) => {
  const { preferences, allergies } = req.body;
  const userId = req.user.userId;

  db.query(
    'UPDATE user SET preferences = ?, food_allergies = ? WHERE user_id = ?',
    [preferences, allergies, userId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error saving preferences' });
      }
      res.status(200).send({ message: 'Preferences saved successfully' });
    }
  );
});

// Example protected route
app.get('/protected-route', authenticateToken, (req, res) => {
  res.send("Access to protected route successful");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
