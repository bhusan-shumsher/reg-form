const util = require('../utils/ex-to-json');
const Teacher = require('../models/teacher');


exports.addTeacher = async(req,res,next)=>{
    try{
        const {name,nameCode,position,title,isFullTime,shift} = req.body;
        const existingUser = await Teacher.findOne({nameCode});
    if(existingUser){
        console.log('Teacher already exists');
        return res.status(400).send({message:'Name already exists'});
    }

    const teacher = new Teacher({name,nameCode,position,title,isFullTime,shift});
    await teacher.save();
    return res.status(201).send(teacher);
    }catch(err){
        console.log(err);
        return res.status(500).send('Unable to create teacher !');
    }
}

exports.addTecherFromExcel = async(req,res,next) =>{
    try{
        const file = req.file;
        const data = util.ex2json(file.path, file.filename);
         const teachers = await Teacher.insertMany(data);
         if(teachers){
             return res.status(201).send({message: teachers.length + ' teachers created'});
         }
         return res.status(500).send({message:'cant create teachers!'});
    }catch(err){
        return res.status(500).send({message: 'Unable to create teacher now'});
    }
}

exports.listAllTeacher = async(req,res,next)=>{
    try{
        console.log(req.query)
        const teacherList = await Teacher.find(req.query).populate('subjects');
        if(Array.isArray(teacherList) && teacherList.length > 0){
            return res.send(teacherList);
        }else{
            return res.send({message:'No Teacher found!'})
        }
    }catch(err){
        return res.status(500).send({message:'Unable to fetch teacher list!'})
    }
}

exports.getTeacherById = async(req,res,next)=>{
    try{
        const teacher = await Teacher.findById(req.params).populate('subjects');
        return res.status(200).send(teacher);
    }catch(err){
        return res.status(500).send({message:'Unable to fetch teacher !'})
    }
}