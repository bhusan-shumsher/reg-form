const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const classLogsController = require('../controller/classLogs');


router.post('/api/classlogs/add',classLogsController.enterClassLogs);
router.get('/api/classlogs',classLogsController.getClassLogs);
module.exports = router;