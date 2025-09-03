const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();

// Enable CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://fciencias-nr4jd8o71-cristopher-carradas-projects.vercel.app'
  ],
  credentials: true,
}));

// Parse JSON
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'FcienciasApp Backend API', status: 'running' });
});

// Auth routes
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, career, semester, interests } = req.body;
    
    // For now, return a success response
    res.status(201).json({
      message: 'Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.',
      email: email
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

app.options('/api/v1/auth/register', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Export for Vercel
module.exports = app;
