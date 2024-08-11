const db = require('./database1');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { spawn } = require('child_process');
const http = require('http');

const app = express();
app.use(express.json());

const server = http.createServer(app);

let pythonProcess = null;

function startPythonProcess() {
  if (pythonProcess) {
    pythonProcess.kill();
  }

  pythonProcess = spawn('python3', ['./testGemini-1.py']);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`Python output: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('exit', (code) => {
    console.error(`Python process exited with code ${code}`);
    pythonProcess = null;
  });
}

app.post('/start-ai', (req, res) => {
  if (!pythonProcess) {
    startPythonProcess();
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

// Example protected route
app.get('/protected-route', authenticateToken, (req, res) => {
  res.send("Access to protected route successful");
});

app.post('/process-input', (req, res) => {
  const userInput = req.body.user_input;

  // Process the user input with your AI model or other logic
  const responseMessage = ask_sous_chef(userInput);

  // Respond with the AI's reply
  res.json({ message: responseMessage });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
