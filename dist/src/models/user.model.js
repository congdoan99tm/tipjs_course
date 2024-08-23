"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';
const userSchema = new mongoose_1.Schema({
    usr_id: { type: Number, require: true },
    usr_slug: { type: String, require: true },
    usr_name: { type: String, default: '' },
    usr_password: { type: String, default: '' },
    usr_salf: { type: String, default: '' },
    usr_email: { type: String, require: true },
    usr_phone: { type: String, default: '' },
    usr_sex: { type: String, default: '' },
    usr_avatar: { type: String, default: '' },
    usr_dob: { type: String, default: null },
    usr_role: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Role' },
    usr_status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'active', 'block'],
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});
exports.default = (0, mongoose_1.model)(DOCUMENT_NAME, userSchema);
