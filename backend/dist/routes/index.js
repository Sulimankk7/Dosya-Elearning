"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const courses_routes_1 = __importDefault(require("./courses.routes"));
const lessons_routes_1 = __importDefault(require("./lessons.routes"));
const enrollments_routes_1 = __importDefault(require("./enrollments.routes"));
const activation_codes_routes_1 = __importDefault(require("./activation-codes.routes"));
const profile_routes_1 = __importDefault(require("./profile.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/courses', courses_routes_1.default);
router.use('/lessons', lessons_routes_1.default);
router.use('/enrollments', enrollments_routes_1.default);
router.use('/activation-codes', activation_codes_routes_1.default);
router.use('/profile', profile_routes_1.default);
router.use('/admin', admin_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map