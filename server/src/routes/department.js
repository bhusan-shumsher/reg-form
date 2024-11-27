const express = require('express');
const router = express.Router();

const isAdmin = require ('../middlewares/is-admin');
const isAuth = require('../middlewares/is-auth');
const isStaff = require('../middlewares/is-staff');
// const User = require('../models/user');
const departmentController = require('../controller/department');



router.post('/api/department/upload-subject-bulk',departmentController.uploadSubjects);

//subject count per department
router.get('/api/subjects/:faculty', departmentController.getSubjectCount);

router.get('/api/subjects',departmentController.getSubjects);

// add new student 
router.post('/api/department/add-new-student',departmentController.addNewStudent);
//add academic info
router.post('/api/department/add-academic-info',departmentController.addAcademicInfo);


// increase semester of all students
router.post('/api/department/increment-semester',departmentController.incrementSemesterByOne);
//filter form 
router.get('/api/department/form-submitted-list',isStaff,departmentController.filterFormSubmitted);

module.exports = router;