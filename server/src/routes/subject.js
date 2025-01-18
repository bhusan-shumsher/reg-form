const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const subjectController = require('../controller/subject');
// router.post('/api/users/signup',[
//     body('email')
//         .isEmail()
//         .withMessage('Must be a valid email address'),
//     body('password')
//         .trim()
//         .isLength({min:4})
//         .withMessage('Password must be atleast 4 characters long')
// ],authController.signup);


router.post('/api/subject/add',subjectController.addSubject);
router.get('/api/subject/list',subjectController.listAllSubject);
router.get('/api/subject/:_id',subjectController.getSubject);
router.post('/api/subject/lessonplan',subjectController.uploadLessonPlan);
module.exports = router;