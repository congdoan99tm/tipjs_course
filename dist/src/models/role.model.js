"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DOCUMENT_NAME = 'Role';
const COLLECTION_NAME = 'Roles';
// const grantList = [
//   { role: 'admin', resource: 'profile', action: 'update:any', attributes: '*' },
//   {
//     role: 'admin',
//     resource: 'balance',
//     action: 'update:any',
//     attributes: '*, !mount',
//   },
//   { role: 'shop', resource: 'profile', action: 'update:own', attributes: '*' },
//   {
//     role: 'shop',
//     resource: 'balance',
//     action: 'update:own',
//     attributes: '*, !mount',
//   },
//   { role: 'user', resource: 'profile', action: 'update:own', attributes: '*' },
//   {
//     role: 'shop',
//     resource: 'profile',
//     action: 'read:own',
//     attributes: '*',
//   },
// ];
const roleSchema = new mongoose_1.Schema({
    rol_name: {
        type: String,
        default: 'user',
        enum: ['user', 'shop', 'admin'],
    },
    rol_slug: { type: String, require: true },
    rol_status: {
        type: String,
        default: 'active',
        enum: ['active', 'block', 'pending'],
    },
    rol_description: { type: String, default: '' },
    rol_grants: [
        {
            resource: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Resource',
                require: true,
            },
            actions: [{ type: String, required: true }],
            attributes: { type: String, default: '*' },
        },
    ],
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});
exports.default = (0, mongoose_1.model)(DOCUMENT_NAME, roleSchema);
