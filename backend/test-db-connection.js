const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Test query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query executed successfully:', result);
    
    console.log('🎉 Supabase connection is working!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
