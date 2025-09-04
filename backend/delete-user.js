const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:RkddRZutC6P7FhkL@db.hlwysacschgrebvxomjs.supabase.co:5432/postgres"
    }
  }
});

async function deleteUser() {
  try {
    console.log('🔍 Buscando usuario carrada@ciencias.unam.mx...');
    
    const user = await prisma.user.findUnique({
      where: { email: 'carrada@ciencias.unam.mx' }
    });
    
    if (user) {
      console.log('👤 Usuario encontrado:', user.email, user.username);
      
      // Eliminar verification tokens relacionados
      await prisma.verificationToken.deleteMany({
        where: { userId: user.id }
      });
      
      // Eliminar el usuario
      await prisma.user.delete({
        where: { id: user.id }
      });
      
      console.log('✅ Usuario eliminado exitosamente');
    } else {
      console.log('ℹ️ No se encontró usuario con ese email');
    }
    
    // Mostrar todos los usuarios restantes
    const allUsers = await prisma.user.findMany({
      select: { email: true, username: true, isEmailVerified: true, createdAt: true }
    });
    
    console.log('\n📋 Usuarios en la base de datos:');
    console.table(allUsers);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteUser();
