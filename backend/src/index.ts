import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import compression from 'compression';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import dotenv from 'dotenv';
import pool from './config/database';
import routes from './routes';
import { AppError } from './utils/errors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust Railway's reverse proxy (required for secure cookies behind a proxy)
app.set('trust proxy', 1);

// --- GLOBAL TIMING LOGGER ---
app.use((req, res, next) => {
    const start = process.hrtime();
    const startTimeMs = Date.now();
    
    // Log when the request is strictly received
    console.log(`\n[${new Date().toISOString()}] ➡️ REQ START | ${req.method} ${req.originalUrl}`);

    res.on('finish', () => {
        const diff = process.hrtime(start);
        const time = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
        console.log(`[${new Date().toISOString()}] ⬅️ REQ END   | ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | Time: ${time}ms`);
    });

    next();
});

// Middleware
app.use(cors({
    origin: [
        "https://dosya-elearning.netlify.app",
        "http://localhost:5173"
    ],
    credentials: true,
    maxAge: 86400, // Cache preflight requests for 24 hours
}));

// Enable GZIP compression
app.use(compression() as any);

// ✅ Add limit to handle base64 image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware (PostgreSQL-backed via connect-pg-simple)
const PgSession = connectPgSimple(session);
app.use(session({
    store: new PgSession({
        pool,
        tableName: 'session',
        createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'dosya-session-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // Enforce Secure and SameSite=none for cross-domain cookies
        // Fallback to lax only if strictly local (e.g., localhost testing without HTTPS)
        secure: process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT === 'production',
        sameSite: (process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT === 'production') ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
}));
app.get("/", (req, res) => {
    res.send("DOSYA backend is running");
});

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});
// Routes
app.use('/api', routes);

// Health check
app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);

    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }

    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`🚀 DOSYA Backend running on http://localhost:${PORT}`);
    console.log(`📋 API available at http://localhost:${PORT}/api`);
});

export default app;
