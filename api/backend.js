const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();

// Enable CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://fciencias.app',
    'https://www.fciencias.app'
  ],
  credentials: true,
}));

// Parse JSON
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'FcienciasApp Backend API', 
    status: 'running', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

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
    
    try {
      await prisma.$connect();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
    }
  }
  return prisma;
}

// Email service functions
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'fciencias.app@gmail.com',
    pass: 'fjrd mcls xhaw wlry' // App password
  }
});

async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://fciencias.app'}/auth/verify?token=${token}`;
  
  const mailOptions = {
    from: '"FCiencias UNAM" <fciencias.app@gmail.com>',
    to: email,
    subject: 'Verifica tu correo institucional - FCiencias UNAM',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1e40af; margin-bottom: 10px;">¡Bienvenido a FCiencias!</h1>
          <p style="color: #6b7280; font-size: 16px;">Verifica tu correo institucional para continuar</p>
        </div>
        
        <div style="background-color: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hola! Gracias por unirte a la red social académica de la Facultad de Ciencias UNAM.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            Para completar tu registro y acceder a todas las funciones, por favor verifica tu correo institucional haciendo clic en el siguiente enlace:
          </p>
          <div style="text-align: center;">
            <a href="${verificationUrl}" 
               style="background-color: #1e40af; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block;">
              Verificar Correo
            </a>
          </div>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <p style="color: #9ca3af; font-size: 14px; text-align: center;">
            Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:<br>
            <span style="word-break: break-all;">${verificationUrl}</span>
          </p>
          <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 20px;">
            Este enlace expirará en 24 horas por seguridad.
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return false;
  }
}

// Validation utilities
function isInstitutionalEmail(email) {
  return email.endsWith('@ciencias.unam.mx');
}

function validatePasswordStrength(password) {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Auth routes
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, username, avatarColor, career, semester, interests } = req.body;

    // Validaciones básicas
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    if (!isInstitutionalEmail(email)) {
      return res.status(400).json({ message: 'Debe usar un correo institucional (@ciencias.unam.mx)' });
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.errors.join(', ') });
    }

    const db = await initializePrisma();

    // Verificar si el usuario ya existe
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return res.status(409).json({ message: 'El usuario ya existe y está verificado' });
      } else {
        // Usuario existe pero no verificado, reenviar email
        const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
        await sendVerificationEmail(email, token);
        return res.json({
          message: 'Se ha reenviado el correo de verificación',
          email
        });
      }
    }

    // Verificar username único
    if (username) {
      const existingUsername = await db.user.findUnique({
        where: { username }
      });
      if (existingUsername) {
        return res.status(409).json({ message: 'El nombre de usuario ya está en uso' });
      }
    }

    // Hash password
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario
    const user = await db.user.create({
      data: {
        email,
        firstName,
        lastName,
        username,
        avatarColor: avatarColor || 'blue',
        hashedPassword,
        career,
        semester,
        interests: interests || [],
        isEmailVerified: false,
      },
    });

    // Generar token y enviar email
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    await sendVerificationEmail(email, token);

    res.json({
      message: 'Usuario registrado. Revisa tu correo para verificar la cuenta.',
      email: user.email
    });

  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Export for Vercel
module.exports = app;

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
