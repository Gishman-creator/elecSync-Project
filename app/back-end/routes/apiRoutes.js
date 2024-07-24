const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { getDailyData } = require('../controllers/chartcontrollers/dailyController');
const { getWeeklyData } = require('../controllers/chartcontrollers/weeklyController');
const { getMonthlyData } = require('../controllers/chartcontrollers/monthlyController');

// Authentication routes
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);

// Chart data routes
// Daily data route
router.get('/data/daily', getDailyData);

// Weekly data route
router.get('/data/weekly', getWeeklyData);

// Monthly data route
router.get('/data/monthly', getMonthlyData);

module.exports = router;
