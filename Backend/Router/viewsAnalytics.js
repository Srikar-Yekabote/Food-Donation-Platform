const express = require('express');
const router = express.Router();
const { getDonorAnalytics } = require('../controllers/analyticsController');
const { ensureAuth, isDonor, verifyToken} = require('../middlewares/auth'); // if you have one

router.get('/donor-analytics', isDonor, getDonorAnalytics);

module.exports = router;

