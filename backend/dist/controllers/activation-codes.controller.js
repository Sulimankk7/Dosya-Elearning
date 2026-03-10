"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activationCodesController = void 0;
const activation_codes_service_1 = require("../services/activation-codes.service");
exports.activationCodesController = {
    async redeem(req, res, next) {
        try {
            const { code } = req.body;
            const result = await activation_codes_service_1.activationCodesService.redeem(req.user.userId, code);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=activation-codes.controller.js.map