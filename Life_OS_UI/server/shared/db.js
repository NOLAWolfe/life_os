import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Standard initialization with explicit log level for debugging
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

// Explicit connection test function
export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('✅ [Database] Successfully connected to SQLite.');
    } catch (error) {
        console.error('❌ [Database] CRITICAL FAILURE: Could not connect to database.');
        console.error(error);
        process.exit(1); // Die immediately if DB is broken
    }
};

export default prisma;
