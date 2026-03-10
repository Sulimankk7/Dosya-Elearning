"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const activation_codes_controller_1 = require("../controllers/activation-codes.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/redeem', auth_middleware_1.authMiddleware, activation_codes_controller_1.activationCodesController.redeem);
exports.default = router;
//# sourceMappingURL=activation-codes.routes.js.map