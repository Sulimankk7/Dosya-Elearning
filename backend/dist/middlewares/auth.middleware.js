"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.optionalAuthMiddleware = optionalAuthMiddleware;
const errors_1 = require("../utils/errors");
function authMiddleware(req, _res, next) {
    if (!req.session || !req.session.userId) {
        return next(new errors_1.UnauthorizedError('No active session'));
    }
    // Populate req.user from session for compatibility with existing middleware (e.g. role.middleware)
    req.user = {
        userId: req.session.userId,
        roleName: req.session.user?.roleName || req.session.user?.role || 'student',
    };
    next();
}
function optionalAuthMiddleware(req, _res, next) {
    if (req.session && req.session.userId) {
        req.user = {
            userId: req.session.userId,
            roleName: req.session.user?.roleName || req.session.user?.role || 'student',
        };
    }
    next();
}
//# sourceMappingURL=auth.middleware.js.map