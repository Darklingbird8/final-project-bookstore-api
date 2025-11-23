import prisma from './src/config/db.js';

console.log('Testing Prisma import...');
console.log('Prisma:', prisma);

try {
  await prisma.$disconnect();
  console.log('✓ Prisma connected and disconnected successfully');
} catch (error) {
  console.error('✗ Prisma error:', error.message);
  process.exit(1);
}
