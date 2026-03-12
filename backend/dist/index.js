"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const express_session_1 = __importDefault(require("express-session"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const routes_1 = __importDefault(require("./routes"));
const errors_1 = require("./utils/errors");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Trust Railway's reverse proxy (required for secure cookies behind a proxy)
app.set('trust proxy', 1);
// Middleware
app.use((0, cors_1.default)({
    origin: [
        "https://dosya-elearning.netlify.app",
        "http://localhost:5173"
    ],
    credentials: true,
    maxAge: 86400, // Cache preflight requests for 24 hours
}));
// Enable GZIP compression
app.use((0, compression_1.default)());
// ✅ Add limit to handle base64 image uploads
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Session middleware (PostgreSQL-backed via connect-pg-simple)
const PgSession = (0, connect_pg_simple_1.default)(express_session_1.default);
app.use((0, express_session_1.default)({
    store: new PgSession({
        pool: database_1.default,
        tableName: 'session',
        createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'dosya-session-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
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
app.use('/api', routes_1.default);
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Error handler
app.use((err, _req, res, _next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    if (err instanceof errors_1.AppError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }
    res.status(500).json({ error: 'Internal server error' });
});
app.listen(PORT, () => {
    console.log(`🚀 DOSYA Backend running on http://localhost:${PORT}`);
    console.log(`📋 API available at http://localhost:${PORT}/api`);
});
exports.default = app;
//# sourceMappingURL=index.js.map