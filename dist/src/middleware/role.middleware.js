"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accesscontrol_1 = require("accesscontrol");
let grantList = [
    {
        role: 'admin',
        resource: 'profile',
        action: 'read:any',
        attributes: '*, !views',
    },
    { role: 'shop', resource: 'profile', action: 'read:own', attributes: '*' },
];
exports.default = new accesscontrol_1.AccessControl(grantList);
