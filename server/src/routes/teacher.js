const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const teacherController = require('../controller/teacher');

// router.post('/api/users/signup',[
//     body('email')
//         .isEmail()
//         .withMessage('Must be a valid email address'),
//     body('password')
//         .trim()
//         .isLength({min:4})
//         .withMessage('Password must be atleast 4 characters long')
// ],authController.signup);


router.post('/api/teacher/add',teacherController.addTeacher);
router.post('/api/teacher/add-bulk',teacherController.addTecherFromExcel);
router.get('/api/teacher/list',teacherController.listAllTeacher);
router.get('/api/teacher/:_id',teacherController.getTeacherById);
module.exports = router;