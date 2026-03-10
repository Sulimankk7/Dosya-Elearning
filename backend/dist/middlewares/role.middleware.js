"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = roleMiddleware;
const errors_1 = require("../utils/errors");
function roleMiddleware(...allowedRoles) {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new errors_1.ForbiddenError('Access denied'));
        }
        if (!allowedRoles.includes(req.user.roleName)) {
            return next(new errors_1.ForbiddenError('Insufficient permissions'));
        }
        next();
    };
}
//# sourceMappingURL=role.middleware.js.map