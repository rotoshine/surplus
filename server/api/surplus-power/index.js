'use strict';

var express = require('express');
var controller = require('./surplus-power.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.post('/share', auth.isAuthenticated(), controller.shareTwitter);
router.get('/:twitterId', controller.getSurplusPower);
router.get('/:twitterId/checked', auth.isAuthenticated(), controller.isCheckedSurplusPower);
router.post('/', auth.isAuthenticated(), controller.checkSurplusPower);


module.exports = router;
