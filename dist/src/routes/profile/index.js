"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const rbac_1 = __importDefault(require("../../middleware/rbac"));
const profile_controller_1 = __importDefault(require("../../controllers/profile.controller"));
// admin
router.get('/viewAny', (0, rbac_1.default)('readAny', 'profile'), profile_controller_1.default.profiles);
// shop
router.get('/viewOwn', (0, rbac_1.default)('readOwn', 'profile'), profile_controller_1.default.profile);
exports.default = router;
