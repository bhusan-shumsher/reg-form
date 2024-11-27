const Result = require('../models/result');
const util = require('../utils/excel-to-json');
const Subject = require('../models/subject');
const backHelper = require('../utils/back-paper');
exports.addBulkResult = async (req,res,next)=>{
    try{
        const {semester,year,semesterType,faculty} = req.body;
    const obj = {
        semester,
        year,
        semesterType,
        faculty
    };
    const file = req.file;
    console.log('**',file);

    const subjectInfoList = await Subject.find({semester, faculty});
    const data = util.ex2json(file.path, file.filename, 'result',null,obj,subjectInfoList);
    const results = await Result.insertMany(data);
    
    return res.status(201).send({message: results.length + ' results added'});

    }catch(err){
        return res.status(500).send({message:err.message});
    }
    
};


exports.getResultById = async (req,res,next)=>{
    // const user = await Result.findOne({rollNumber: req.params.rollNumber,grades: {$elemMatch:{grade:'A'}}});
    const user = await Result.find().where('grades').elemMatch({subject:'Oracle'})
    res.send(user);
}


exports.getStudentResult = async (req,res,next)=>{
    const {rollNumber} = req;
    const result = await Result.aggregate([
        {$match:{rollNumber}},
        {$group:{_id:'$semester',grades:{
            $push:{sgpa:'$sgpa',result:'$grades'}
        }
    }},
    {$sort:{_id: 1}}
    ]);

    if(result){
        res.status(200).send(result);
    }else{
        res.status(501);
    }
};

exports.getBacklog = async (req,res,next)=>{
    const {rollNumber} = req;
    const backlog = await Result.aggregate([
        {$match:{rollNumber}},
        {$unwind: '$grades'},
        { $match: { $or: [
            { 'grades.grade': 'F' }, 
            { 'grades.grade': 'Abs' }, 
            { 'grades.grade': 'Expelled' },
            {'grades.grade':'CNR'},
            {'grades.grade':'NQ'}
        ] } }] );
      console.log(backlog);  
    if(!backlog){
       return  res.status(500).send({message:'cant get backlog'});
    }
    return res.status(200).send(backlog);
};


// GET GRADE COUNTS 
exports.getGradeCounts = async (req,res,next)=>{
    try{
        const {rollNumber} = req;
        const grades = await Result.aggregate([
            {$match: {rollNumber}},
            {$unwind: '$grades'},
            {$group:{_id:'$grades.grade',count:{$sum:1}}}
        ]);
        if(!grades){
            throw new Error('cant fetch grades');
        }
        return res.status(200).send(grades);
    }catch(err){
        return res.status(500).send({message:err.message});
    }
}

// add resutls of individual student
exports.addResult = async (req,res,next)=>{
    try{
        const {rollNumber, examRollNumber, year,semester, semesterType, faculty,sgpa, grades} = req.body;
        console.log(rollNumber);
        const result = new Result({
            rollNumber, 
            examRollNumber,
            year,
            semesterType,
            faculty,
            sgpa,
            grades,
            semester
        });
        await result.save();
        return res.status(200).send({message:'result saved'});
    }catch(err){
        return res.status(501).send({message:err.message});
    }
}

//edit result 
exports.editResult = async(req,res,next)=>{
    try{
        const {semester, rollNumber,sgpa, grades} = req.body;
        const updatedResult = await Result.updateMany(
            {$and:[{semester:semester},{rollNumber}]},
            {$set:{sgpa: sgpa, grades: grades}}
        );
        if(updatedResult.modifiedCount < 1){
            return res.status(200).send({message:"nothing to update"});

        }
        return res.status(200).send(updatedResult);
    }catch(err){
        return res.status(500).send({message: err.message});
    }
}

// GET SUBJECT NAME FOR GIVEN CODE AND FACULTY
exports.getSubjectBySemester = async(req,res,next)=>{
    try{
        const {faculty,semester} = req.body;
        const subjects = await Subject.find({
            $and:[{faculty},{semester}]
        });
        if(subjects.length <1){
            throw new Error('No subjects');
        }
        return res.status(200).send(subjects);
    }catch(err){
        return res.status(500).send({message: err.message});
    }
}

// BACK PAPER BULK ENTRY
exports.postBulkBackPaper = async (req,res,next)=>{
    try{
        
    const file = req.file;
    const array = backHelper.readBacks(file.path, file.filename);
    const ans = array.forEach(subArray=> subArray.forEach(async data=>{
        await Result.updateOne({
            $and:[{rollNumber:data.rollNumber},{'grades.courseCode':data.courseCode}]
        },
        {$set:{'grades.$.grade':data.grade}}
        )
    }))
    return res.status(200).send(ans);

    }catch(err){
        return res.status(500).send({message: err.message})
    }
}
