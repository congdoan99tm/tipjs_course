const express = require('express');
const router = express.Router();
const grantAccess = require('../../middleware/rbac');
const { profiles, profile } = require('../../controllers/profile.controller');

// admin

router.get('/viewAny', grantAccess('readAny', 'profile'), profiles);

// shop

router.get('/viewOwn', grantAccess('readOwn', 'profile'), profile);

module.exports = router;
