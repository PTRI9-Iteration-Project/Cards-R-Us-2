const express = require('express');
const router = express.Router();

// Github oauth provider route
const gitHubRouter = require('./github');
const googleRouter = require('./google');
router.use('/gh', gitHubRouter);
router.use('/google', googleRouter);

module.exports = router;
