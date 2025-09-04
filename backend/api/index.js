const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// Create Express app
const app = express();

// Enable CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://fciencias.app',
    'https://*.vercel.app'
  ],
  credentials: true,
}));

// Parse JSON
app.use(express.json());

// Create email transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'FcienciasApp Backend API', status: 'running' });
});

// Auth routes
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, career, semester, interests } = req.body;
    
    console.log('Registro iniciado para:', email);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        firstName,
        lastName,
        career,
        semester: parseInt(semester),
        interests: interests || [],
        username: email.split('@')[0],
        avatarColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        emailVerificationToken: verificationToken,
        isEmailVerified: false
      }
    });
    
    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verifica tu cuenta - FcienciasApp',
      html: `
        <h2>¡Bienvenido a FcienciasApp!</h2>
        <p>Hola ${firstName},</p>
        <p>Gracias por registrarte. Para activar tu cuenta, haz clic en el siguiente enlace:</p>
        <a href="${verificationUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verificar Email</a>
        <p>Si no puedes hacer clic en el enlace, copia y pega esta URL en tu navegador:</p>
        <p>${verificationUrl}</p>
      `
    });
    
    console.log('Usuario creado exitosamente:', user.email);
    
    res.status(201).json({
      message: 'Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.',
      email: email
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error al crear la cuenta. Inténtalo de nuevo.' });
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
