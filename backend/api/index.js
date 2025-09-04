const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create Express app
const app = express();

// Initialize Prisma with production database
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres:RkddRZutC6P7FhkL@db.hlwysacschgrebvxomjs.supabase.co:5432/postgres"
    }
  }
});

// Enable CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://fciencias.app',
    'https://fciencias-app.vercel.app',
    'https://fciencias-b6gp0kpx2-cristopher-carradas-projects.vercel.app'
  ],
  credentials: true,
}));

// Parse JSON
app.use(express.json());

// Email transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'fciencias.app@gmail.com',
    pass: process.env.EMAIL_PASS || 'fjrd mcls xhaw wlry'
  }
});

// Generate avatar colors
const avatarColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

function getRandomAvatarColor() {
  return avatarColors[Math.floor(Math.random() * avatarColors.length)];
}

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'FcienciasApp Backend API', status: 'running', timestamp: new Date().toISOString() });
});

app.get('/api/v1/health', (req, res) => {
  res.json({ message: 'FcienciasApp Backend API', status: 'running', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, career, semester, interests } = req.body;
    
    console.log('Registration attempt for:', email);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Ya existe un usuario con este correo electrónico' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Generate username from email
    const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        firstName,
        lastName,
        username,
        career,
        semester: parseInt(semester),
        interests: interests || [],
        avatarColor: getRandomAvatarColor(),
        isEmailVerified: false
      }
    });
    
    // Create verification token
    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        type: 'EMAIL_VERIFICATION',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    });
    
    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL || 'https://fciencias.app'}/auth/verify-email?token=${verificationToken}`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'fciencias.app@gmail.com',
      to: email,
      subject: 'Verifica tu cuenta - fciencias.app',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d;">¡Bienvenido a fciencias.app!</h2>
          <p>Hola ${firstName},</p>
          <p>Gracias por registrarte en fciencias.app. Para completar tu registro, por favor verifica tu correo electrónico:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Verificar mi correo
            </a>
          </div>
          <p>Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:</p>
          <p style="word-break: break-all; color: #3182ce;">${verificationUrl}</p>
          <p>Este enlace expirará en 24 horas.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
          <p style="color: #718096; font-size: 14px;">
            Si no te registraste en fciencias.app, puedes ignorar este correo.
          </p>
        </div>
      `
    });
    
    console.log('User created successfully:', user.email);
    
    res.status(201).json({
      message: 'Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.',
      email: email
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error al registrar usuario: ' + error.message });
  }
});

// Email verification route
app.get('/api/v1/auth/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ message: 'Token de verificación requerido' });
    }
    
    // Find verification token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        type: 'EMAIL_VERIFICATION',
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: true
      }
    });
    
    if (!verificationToken) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }
    
    // Update user as verified
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { isEmailVerified: true }
    });
    
    // Delete verification token
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id }
    });
    
    res.json({ message: 'Email verificado exitosamente' });
    
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Error al verificar email' });
  }
});

app.options('/api/v1/auth/register', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

app.options('/api/v1/auth/verify-email', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Export for Vercel
module.exports = app;
