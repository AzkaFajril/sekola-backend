import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import newsRoutes from './routes/news.js';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import prestasiRoutes from './routes/Prestasi.js';
import bannerRoutes from "./routes/banner.js";
import staffGuruRoutes from "./routes/StaffGuru.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portalberita';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sekola';
const MONGODB_DB = process.env.MONGODB_DB || 'sekola';

let client;
let db;
let server;
let isShuttingDown = false;

// Crash detection and monitoring
const crashMonitor = {
    startTime: Date.now(),
    crashCount: 0,
    lastCrashTime: null,
    healthChecks: 0,
    
    logCrash(error) {
        this.crashCount++;
        this.lastCrashTime = new Date();
        console.error('🚨 CRASH DETECTED:', {
            timestamp: this.lastCrashTime,
            crashCount: this.crashCount,
            uptime: this.getUptime(),
            error: error.message,
            stack: error.stack
        });
    },
    
    getUptime() {
        return Date.now() - this.startTime;
    },
    
    getHealthStats() {
        return {
            uptime: this.getUptime(),
            crashCount: this.crashCount,
            lastCrashTime: this.lastCrashTime,
            healthChecks: this.healthChecks
        };
    }
};

// Enhanced database connection with better error handling
async function connectDB() {
    const maxRetries = 5;
    let retryCount = 0;
    
    // Validate MONGODB_URI
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    console.log('🔗 Attempting to connect to MongoDB...');
    console.log(' Connection details:', {
        uri: MONGODB_URI,
        database: MONGODB_DB,
        retries: maxRetries
    });
    
    while (retryCount < maxRetries) {
        try {
            if (!client || !client.topology?.isConnected()) {
                client = new MongoClient(MONGODB_URI, {
                    serverSelectionTimeoutMS: 5000,
                    socketTimeoutMS: 45000,
                    connectTimeoutMS: 10000,
                    maxPoolSize: 10,
                    minPoolSize: 1
                });
                
                await client.connect();
                db = client.db(MONGODB_DB);
                
                // Test the connection
                await db.admin().ping();
                
                console.log('✅ MongoDB connected successfully');
                console.log('📊 Database info:', {
                    name: db.databaseName,
                    collections: await db.listCollections().toArray().then(cols => cols.map(c => c.name))
                });
                
                return db;
            }
            return db;
        } catch (error) {
            retryCount++;
            console.error(`❌ MongoDB connection attempt ${retryCount} failed:`, {
                error: error.message,
                code: error.code,
                retryCount,
                maxRetries
            });
            
            if (retryCount >= maxRetries) {
                console.error('❌ MongoDB connection failed after all retries');
                console.error('🔧 Troubleshooting tips:');
                console.error('   1. Check if MongoDB is running');
                console.error('   2. Verify MONGODB_URI in .env file');
                console.error('   3. Check network connectivity');
                console.error('   4. Verify database permissions');
                throw error;
            }
            
            // Wait before retry (exponential backoff)
            const waitTime = Math.pow(2, retryCount) * 1000;
            console.log(`⏳ Waiting ${waitTime}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
}

// Enhanced mongoose connection
async function connectMongoose() {
    try {
        console.log('🔗 Attempting to connect to Mongoose...');
        console.log('📊 Mongoose URI:', MONGO_URI);
        
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            maxPoolSize: 10,
            minPoolSize: 1
        });
        
        console.log('✅ Mongoose connected successfully');
        
        // Test the connection
        await mongoose.connection.db.admin().ping();
        
    } catch (error) {
        console.error('❌ Mongoose connection error:', {
            error: error.message,
            code: error.code
        });
        throw error;
    }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    crashMonitor.healthChecks++;
    
    const health = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: crashMonitor.getUptime(),
        database: {
            mongoose: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
            mongodb: client?.topology?.isConnected() ? 'connected' : 'disconnected'
        },
        environment: {
            NODE_ENV: process.env.NODE_ENV || 'development',
            PORT: PORT,
            MONGODB_URI: MONGODB_URI ? 'configured' : 'not configured',
            MONGO_URI: MONGO_URI ? 'configured' : 'not configured'
        },
        crashStats: crashMonitor.getHealthStats(),
        memory: process.memoryUsage()
    };
    
    res.json(health);
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
    crashMonitor.logCrash(err);
    
    console.error('❌ Unhandled error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });
    
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
        timestamp: new Date().toISOString()
    });
});

// Graceful shutdown function
async function gracefulShutdown(signal) {
    if (isShuttingDown) return;
    isShuttingDown = true;
    
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
    
    try {
        // Close server
        if (server) {
            server.close(() => {
                console.log('✅ HTTP server closed');
            });
        }
        
        // Close MongoDB connections
        if (client) {
            await client.close();
            console.log('✅ MongoDB client closed');
        }
        
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('✅ Mongoose connection closed');
        }
        
        console.log('✅ Graceful shutdown completed');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
}

// Process event handlers
process.on('uncaughtException', (error) => {
    crashMonitor.logCrash(error);
    console.error('❌ Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
    crashMonitor.logCrash(new Error(`Unhandled Rejection: ${reason}`));
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
});

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Memory leak detection
setInterval(() => {
    const memUsage = process.memoryUsage();
    const memUsageMB = {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024)
    };
    
    // Alert if memory usage is high
    if (memUsageMB.heapUsed > 500) { // 500MB threshold
        console.warn('⚠️ High memory usage:', memUsageMB);
    }
    
    // Log memory usage every 5 minutes
    if (Date.now() % 300000 < 1000) { // Every 5 minutes
        console.log('📊 Memory usage:', memUsageMB);
    }
}, 30000); // Check every 30 seconds

// Database connection monitoring
setInterval(async () => {
    try {
        if (mongoose.connection.readyState !== 1) {
            console.warn('⚠️ Mongoose connection lost, attempting reconnect...');
            await connectMongoose();
        }
        
        if (!client?.topology?.isConnected()) {
            console.warn('⚠️ MongoDB client disconnected, attempting reconnect...');
            await connectDB();
        }
    } catch (error) {
        console.error('❌ Database reconnection failed:', error);
    }
}, 60000); // Check every minute

// Initialize database connections
async function initializeApp() {
    try {
        console.log('🚀 Starting application...');
        console.log('📊 Environment variables:', {
            NODE_ENV: process.env.NODE_ENV || 'development',
            PORT: PORT,
            MONGODB_URI: MONGODB_URI,
            MONGO_URI: MONGO_URI
        });
        
        // Connect to databases
        await Promise.all([
            connectMongoose(),
            connectDB()
        ]);
        
        // Routes
        app.get('/', (req, res) => {
            res.send('Portal Berita Backend Running');
        });
        
        app.use('/api/auth', authRoutes);
        app.use('/api/news', newsRoutes);
        app.use('/api/prestasi', prestasiRoutes);
        app.use("/api/banner", bannerRoutes);
        app.use("/api/staff-guru", staffGuruRoutes);
        
        app.post("/register", async (req, res) => {
            try {
                const { username, password } = req.body;
                if (!username || !password) {
                    return res.status(400).json({ message: "Username dan password wajib diisi" });
                }
        
                const db = await connectDB();
                const users = db.collection("users");
        
                // Cek apakah username sudah ada
                const existingUser = await users.findOne({ username });
                if (existingUser) {
                    return res.status(400).json({ message: "Username sudah terdaftar" });
                }
        
                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);
        
                // Simpan user baru
                await users.insertOne({ username, password: hashedPassword });
        
                return res.status(201).json({ message: "Register berhasil" });
            } catch (error) {
                console.error("Register error:", error);
                return res.status(500).json({ message: "Gagal register", error: error.message });
            }
        });
        
        // Start server
        server = app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(` Health check: http://localhost:${PORT}/api/health`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
        
        // Server error handling
        server.on('error', (error) => {
            crashMonitor.logCrash(error);
            console.error('❌ Server error:', error);
        });
        
    } catch (error) {
        console.error('💥 Failed to initialize app:', error);
        console.error('🔧 Please check your environment variables and database connection');
        process.exit(1);
    }
}

// Start the application
initializeApp().catch(error => {
    console.error('💥 Application startup failed:', error);
    process.exit(1);
});
