const express = require('express');
const {AuthMiddleware} = require('../../middlewares');
const {protectRoute, adminRoute} = AuthMiddleware;

const {AnalyticsController} = require('../../controllers');


const router = express.Router();

router.get('/analytics',protectRoute, adminRoute, AnalyticsController.analyticsData)

module.exports = router;
