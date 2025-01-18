const util = require('../utils/ex-to-json')

const Subject = require('../models/currentSubject');
const Teacher = require('../models/teacher');

exports.addSubject = async(req,res,next)=>{
    try{
        const {name,shortName,faculty,semester,shift,courseCode,teacherCode} = req.body;
        const teacher = await Teacher.findOne({nameCode: teacherCode});
        if(!teacher){
            return res.status(500).send({message:'Unable to find the teacher !'})
        }
        console.log(teacher);
        const subject = new Subject({name,shortName,faculty,semester,shift,courseCode,teacher});
        await subject.save();
        await Teacher.findByIdAndUpdate(teacher._id,{
            $push:{
                subjects: subject._id
            }
        })
        return res.send(subject);
    }catch(err){
        console.log(err)
        return res.status(500).send('Unable to create subject !');
    }
}



exports.listAllSubject = async(req,res,next)=>{
    try{
        const subjectList = await Subject.find(req.query).populate('teacher');
        console.log(subjectList)
        if(Array.isArray(subjectList) && subjectList.length > 0){
            return res.send(subjectList);
        }else{
            return res.send({message:'No Subject found!'})
        }
    }catch(err){
        return res.status(500).send({message:'Unable to fetch subject list!'})
    }
}


exports.getSubject = async(req,res,next)=>{
    try{
        const subject = await Subject.findById(req.params).populate('teacher');
        return res.status(200).send(subject);
    }catch(err){
        return res.status(500).send({message: 'Unable to fetch the subject'})
    }
}


exports.uploadLessonPlan = async(req,res,next)=>{
    try{
        const {subject_id} = req.body;
        var subject;
        try{
            subject = await Subject.findById({_id: subject_id});
        }catch(err){
            return res.status(500).send({message: 'Unable to find the subject'});
        }

        const file = req.files;
        if(Array.isArray(file) && file.length > 0){
            var plan = util.ex2json(file[0].path);
            await Subject.findByIdAndUpdate(subject_id,{
                $push:{
                    lessonPlan: plan
                }
            })
        }
        return res.status(201).send({message:'Lesson Plan Uploaded'});
    }catch(err){
        console.log(err);
        return res.status(500).send({message:'Unable to upload Excel Sheet'});
    }
}