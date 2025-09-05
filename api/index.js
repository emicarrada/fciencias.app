// API proxy for Vercel - forwards requests to backend
module.exports = require('../backend/api/index.js');

// Initialize database connection only when needed
let prisma = null;
async function initializePrisma() {
  if (!prisma) {
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });
  }
  return prisma;
}

// Auth routes
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, career, semester, interests } = req.body;
    
    console.log('Registration attempt for:', email);
    
    // Initialize database
    const db = await initializePrisma();
    const bcrypt = require('bcrypt');
    const crypto = require('crypto');
    const nodemailer = require('nodemailer');
    
    // Generate avatar colors
    const avatarColors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    
    function getRandomAvatarColor() {
      return avatarColors[Math.floor(Math.random() * avatarColors.length)];
    }
    
    // Check if user already exists
    const existingUser = await db.user.findUnique({
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
    const user = await db.user.create({
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
    await db.verificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        type: 'EMAIL_VERIFICATION',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    });
    
    // Send verification email
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const verificationUrl = `${process.env.FRONTEND_URL || 'https://fciencias.app'}/auth/verify-email?token=${verificationToken}`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
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
    
    // Initialize database
    const db = await initializePrisma();
    
    // Find verification token
    const verificationToken = await db.verificationToken.findFirst({
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
    await db.user.update({
      where: { id: verificationToken.userId },
      data: { isEmailVerified: true }
    });
    
    // Delete verification token
    await db.verificationToken.delete({
      where: { id: verificationToken.id }
    });
    
    res.json({ message: 'Email verificado exitosamente' });
    
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Error al verificar email' });
  }
});

// CORS preflight handlers
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
