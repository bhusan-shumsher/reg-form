const mongoose = require('mongoose');
const ClassLogs = require('../models/classLogs');
const Subject = require('../models/currentSubject');
const Teacher = require('../models/teacher');

exports.enterClassLogs = async(req,res)=>{
    try{
        const {faculty,nameCode,shortName,
            semester,shift,time,timing,type,englishDate,
            nepaliDate,day,mode,attendance,remark} = req.body;
        
        const subject = await Subject.findOne({faculty,semester,shift,shortName}).populate('lessonPlan');
        // CHECK IF THE LESSON PLAN IS UPLOADED 
        if(!subject){
            return res.status(500).send({message:'Unkown Subject'});
        }
        if(!subject.teacher._id){
            return res.status(500).send({message:'No teacher assigned for the course'});
        }
        const logs = await ClassLogs.find({faculty,
            subject: subject._id,
            semester,shift,mode});
        console.log('7777',logs);
        console.log(logs.length);
        var topic;
        if(subject && Array.isArray(subject.lessonPlan) && subject.lessonPlan.length >0){
            console.log(subject?.lessonPlan[logs.length]);
            topic = subject?.lessonPlan[logs.length]?.topic || 'No lesson Plan';
        }
        else{
            console.log('NO LOGS PROVIDED');
            topic = 'No lecture plan found';
        }
        console.log(topic);
        console.log(subject.teacher._id);
         const logEntry = await ClassLogs({
            teacher: new mongoose.Types.ObjectId(subject.teacher._id),
            subject: new mongoose.Types.ObjectId(subject._id),
            time,
            shift,
            mode,
            timing,
            type,
            englishDate,
            nepaliDate,
            day,
            faculty,
            semester,
            topic,
            attendance,
            remark,
            time,
            lectureNum: logs?.length + 1 || 1
         });
         await logEntry.save();
        

        await Subject.updateOne({"lessonPlan.lecture":logs?.length + 1 || 1},{
            $set:{"lessonPlan.$.isComplete": true}
        })
        return res.status(200).send(logEntry);
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Unable to add class log'});
    }
}

exports.getClassLogs = async(req,res)=>{
    try{
        const limit = 20; //record per page 
        const page = req.query.page || 1;
         const query = await buildQuery(req.query);
         const totalDoc = await ClassLogs.countDocuments(query);
        //  console.log(totalDoc);
        //  if((page * limit) > totalDoc){
        //     return res.status(500).send({message:'Requested Page Exceeds the Limit'})
        //  }
         let logs = await ClassLogs.find(query)
            .populate('teacher')
            .populate({
                path:'subject',
                select: 'name'
            })
            .skip((page -1) * limit)
            .limit(limit)
            .lean();
        
        const absentCount = itemCounter(logs,'timing','Absent');
        const onTimeCount = itemCounter(logs,'timing','On-Time');
        const earlyExitCount = itemCounter(logs,'timing','Early-Exit');
        const lateCount = itemCounter(logs,'timing','Late');
        const labCount = itemCounter(logs,'mode','Lab');
        const lectureCount = itemCounter(logs,'mode','Lecture');
        const regularClassCount = itemCounter(logs,'type','Regular');
        const swappedClassCount = itemCounter(logs,'type','Swap');
        const replacementClassCount = itemCounter(logs,'type','Replacement');
        const extraCount = itemCounter(logs,'type','Extra');

        let count = {absentCount,onTimeCount,earlyExitCount,lateCount,labCount,
            lectureCount,regularClassCount,swappedClassCount,replacementClassCount,extraCount};
            console.log(count);
        
        // logs['fck'] = count;
        // console.log(logs)
        return res.status(200).json({
            logs,
            count: count});
       
    }catch(err){
        console.log(err);
        return res.status(500).send({message:'Unable to fetch class logs'});
    }
}


const buildQuery =  async(filters) =>{
    var query = {};
    if (filters.semester) query.semester = parseInt(filters.semester);
    if(filters.shift) query.shift = filters.shift;
    const teacher =await Teacher.findOne({nameCode: filters.teacher}).select('name subjects');
    // const subject = await Subject.findOne({shortName: filters.subject}).select('name shift semester facukty');
    // if (subject) query.subject = subject_id;
    if(teacher) query.teacher = teacher._id;
    if(filters.mode) query.mode = filters.mode;
    if(filters.faculty) query.faculty = filters.faculty;
    console.log(query);
    return query;
}


const itemCounter = (array,field, value) => {
    return array.filter((x) => x[field] == value).length;
};
