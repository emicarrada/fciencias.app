import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, careerId } = body;

    // Validaciones básicas
    if (!name || !email || !password || !careerId) {
      return NextResponse.json({ 
        success: false,
        message: 'Faltan campos requeridos (name, email, password, careerId)' 
      }, { status: 400 });
    }

    // Test simple sin base de datos
    return NextResponse.json({
      success: true,
      message: '✅ API funcionando correctamente! Datos recibidos.',
      data: {
        name,
        email: email.replace(/./g, '*'), // Ocultar email por privacidad
        careerId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('❌ Error en registro:', error);
    
    return NextResponse.json({ 
      success: false,
      message: 'Error interno del servidor',
      error: error.message 
    }, { status: 500 });
  }
}

// Options for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
