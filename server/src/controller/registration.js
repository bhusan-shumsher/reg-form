const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NewStudent = require('../models/newstudent');
const util = require('../utils/randomDigit');
const RegistrationDetail = require('../models/registrationDetail');
const fs = require('fs');
// const mime = require('mime-types');
const handlebars = require("handlebars");
const puppeteer = require('puppeteer');
const path = require("path");
// const url = require('url');
const NepaliDate = require('nepali-date-converter');
const excel = require('../utils/registerFromExcel');

exports.signup = async (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).send({mesasge:"Invalid email or password"});
    }

    const {email,faculty} = req.body;
    
    const existingUser = await NewStudent.findOne({email});
    if(existingUser){
        console.log('email already in use');
        return res.status(400).send({message:'User already exists'});
    }
    const password = util.randomDigitGenerator();

    const user = new NewStudent({email, password,faculty});
    await user.save();
    res.status(201).send(user);
}

exports.login = async (req,res,next)=>{
    const {email,password} = req.body;
    const existingUser = await NewStudent.findOne({email});
    console.log(existingUser)
    if(!existingUser){
        return res.status(401).send({message: 'User not found'});
    }
    if(password !== existingUser.password){
        return res.status(401).send({message:'Wrong password'});
    }
    const token = jwt.sign({
        email: existingUser.email,
        id: existingUser._id.toString(),
        role: existingUser.role
    },'secret',
    {expiresIn: '1h'});
    return res.status(200).send({token:token});

}

exports.bulkUpload = async (req,res,next)=>{
    try{
        const file = req.files[0]; // changed this to read the first file 
        const {faculty} = req.body;
        console.log(faculty);
        const data = excel.registerBulk(file.path,faculty);
         const users = await NewStudent.insertMany(data);
         if(users){
             return res.status(201).send({message: users.length + ' users created'});
         }
         return res.status(500).send({message:'cant create users!'});
    }catch(err){
        return res.status(500).send({message: err.message});
    }
    
}

exports.saveDetails = async (req,res,next)=>{
    try{
        console.log(req.body);
        const user = await RegistrationDetail.find({email: req.email});
        const {
            plusTwoAddress,
            schoolAddress,
            program,title,fullName,fullNameDevanagari,
            fatherName, motherName,nationality,
            religion,ethnicity,
            townVillage,wardNum,district,zone,
            schoolName,secondaryBoard,secondaryYear,secondaryTotalMarks,
            secondaryMarksObtained,secondaryDivision,
            secondarySymbol,
            plusTwoName,plusTwoBoard,plusTwoYear,
            plusTwoTotalMarks,plusTwoMarksObtained,plusTwoDivision,plusTwoSymbol,dobEnglish,gender
        } = req.body;

        // console(req.email,devanagariNam);

        // Handle the uploaded files
    const file = req.files[0];
    var faculty;
        if(program === 'BBA'){
             faculty ='Management'
        }else{
             faculty = 'Science & Technology'
        }
    // Process and store the files as required
    // For example, save the files to a specific directory using fs module
   
        const dir = `src/files/registration/${program}/${req.email}`;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        const filePath = `${dir}/${file.filename}`;
        fs.rename(file.path, filePath, (err) => {
        if (err) {
            // Handle error appropriately and send an error response
            return res.status(500).send({ error: 'Failed to store the file' });
        }
        });
        
        const engDate = new Date(dobEnglish);
         const dobE = engDate.getFullYear()+'-'+(engDate.getMonth() + 1) +'-'+engDate.getDate();

        const nepali = new NepaliDate(changeToStamp(dobE));
        const dobNepali = nepali.getBS().year + '-' +(nepali.getBS().month+1) +'-'+ nepali.getBS().date;
    const details = new RegistrationDetail({
        email: req.email,
        faculty,title,fullName,fullNameDevanagari,
            fatherName, motherName,nationality,
            religion,ethnicity,
            townVillage,wardNum,district,zone,
            schoolName,secondaryBoard,secondaryYear,secondaryTotalMarks,
            secondaryMarksObtained,secondaryDivision,
            secondarySymbol,
            plusTwoName,plusTwoBoard,plusTwoYear,
            plusTwoTotalMarks,plusTwoMarksObtained,plusTwoDivision,plusTwoSymbol,dobEnglish,
            program,
            photoURL: filePath,
            dobEnglish: dobE,
            dobNepali,
            gender,
            schoolAddress,
            plusTwoAddress
    });
    if(user.length>0){
        await RegistrationDetail.findOneAndUpdate({email:req.email},{
            faculty,title,fullName,fullNameDevanagari,
            fatherName, motherName,nationality,
            religion,ethnicity,
            townVillage,wardNum,district,zone,
            schoolName,secondaryBoard,secondaryYear,secondaryTotalMarks,
            secondaryMarksObtained,secondaryDivision,
            secondarySymbol,
            plusTwoName,plusTwoBoard,plusTwoYear,
            plusTwoTotalMarks,plusTwoMarksObtained,plusTwoDivision,plusTwoSymbol,dobEnglish,
            program,
            photoURL: filePath,
            dobEnglish: dobE,
            dobNepali
        });
    }else{
        await details.save();
    }

    // Send an appropriate response to the client
    return res.status(200).send({ message: 'Data Saved' });

    }catch(err){
        return res.status(500).send({message: err.message});

    }


}


// GENERATE REGISTRATION FORM 

exports.generateRegistrationForm = async (req,res,next)=>{
    try{

        const email = req.email;
        const user = await RegistrationDetail.find({email});
        if(!user){
            return res.status(500).send({message:'cant find data'});
        }
        
        console.log('user',user);
        const name = user[0].fullName.toUpperCase();
        const data ={
            email: req.email,
            title: user[0].title,
            fullName: addSpace(name).split(''),
            faculty: user[0].faculty,
            level: user[0].level.toUpperCase(),
            program: user[0].program.toUpperCase(),
            fullNameDevanagari: user[0].fullNameDevanagari,
            dobEnglish: splitDate(user[0].dobEnglish),
            dobNepali: splitDate(user[0].dobNepali),
            nationality: user[0].nationality.toUpperCase(),
            ethinicity: user[0].ethnicity.toUpperCase(),
            religion: user[0].religion.toUpperCase(),
            fatherName: addSpace(user[0].fatherName.toUpperCase()).split(''),
            motherName: addSpace(user[0].motherName.toUpperCase()).split(''),
            wardNum: user[0].wardNum,
            townVillage: user[0].townVillage.toUpperCase(),
            zone: user[0].zone.toUpperCase().toUpperCase(),
            district: user[0].district.toUpperCase(),
            secondaryBoard: user[0].secondaryBoard.toUpperCase(),
            secondaryYear: user[0].secondaryYear,
            secondaryTotalMarks: user[0].secondaryTotalMarks,
            secondaryMarksObtained: user[0].secondaryMarksObtained,
            secondaryDivision: user[0].secondaryDivision,
            secondarySymbol: user[0].secondarySymbol,
            plusTwoBoard: user[0].plusTwoBoard.toUpperCase(),
            plusTwoTotalMarks: user[0].plusTwoTotalMarks,
            plusTwoMarksObtained:user[0].plusTwoMarksObtained,
            plusTwoDivision: user[0].plusTwoDivision,
            plusTwoSymbol: user[0].plusTwoSymbol,
            photoURL: toBase64(user[0].photoURL),
            logo: toBase64('src/files/registration/logo.jpg'),
            currentDate: getTodayDate(),
            signature: toBase64(user[0].signature),
            plusTwoYear: user[0].plusTwoYear,
            rkbSign: toBase64('src/files/registration/rkb.png'),
            principalSign: toBase64('src/files/registration/khakurel.png')
        };
        const templateHtml = fs.readFileSync(path.join(process.cwd(), 'src/template/newForm.html'), 'utf8');
        
        var template = handlebars.compile(templateHtml);
	    var html = template(data);

    // var pdfPath = path.join('form');
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
		headless: 'new'
	});
    var page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.emulateMediaType('screen');
    // create a folder 
    try{
        if(!fs.existsSync(`src/files/registration/${data.program}/${data.email}`)){
            fs.mkdirSync(`src/files/registration/${data.program}/${data.email}`);
        }
    }catch(err){
        console.log(err)
        return res.status(500).send({message:err.message});
    }
    console.log('folder created');

    // Downlaod the PDF
  const pdf = await page.pdf({
    path: `src/files/registration/${data.program}/${data.email}/registration.pdf`,
    margin: { top: '30px', right: '20px', bottom: '0px', left: '20px' },
    printBackground: true,
    // width: '595px',
    // height:'842px',
    format: 'A4'
  });

//   Close the browser instance
  await browser.close();
  await NewStudent.updateOne({email:req.email},{$set:{hasSubmitted: true}}); // Marked as submitted 

  return res.status(200).send({message:'success !'});
    
    }catch(err){
        // console.log(err);
        return res.status(500).send({message:err.message});
    }
}







function changeToStamp(str){
    const date = new Date(str);


    const timestamp = date.getTime();
    console.log(timestamp);
    return timestamp;
}


function addSpace(str) {
    console.log(str.split(' ').join('   '));
    return str.split(' ').join('  ');
  }

function splitDate(str){
    return str.split('-')
}

function toBase64(filePath) {
    const img = fs.readFileSync(filePath);
  
    return 'data:image/png;base64,'+ Buffer.from(img).toString('base64');
  }

  function getTodayDate(){
    const date = new Date();
    let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

// This arrangement can be altered based on how we want the date's format to appear.
let currentDate = `${year}-${month}-${day}`;
console.log(currentDate); 
return currentDate;
  }


  // TO GET SIGNATURE
  exports.uploadSignature = async(req,res,next)=>{
    try{
        const file = req.files[0];
        const email = req.email;
        console.log(file);
        const user = await RegistrationDetail.find({email});
        if(!user || user.length<1){
            throw new Error('no record found');
        }
        const {program} = user[0];
        const dir = `src/files/registration/${program}/${email}`;

        //CREATE A FOLDER
        try{
            if(!fs.existsSync(`src/files/registration/${program}/${email}`)){
                fs.mkdirSync(`src/files/registration/${program}/${email}`);
            }
        }catch(err){
            console.log(err);
            throw new Error('Cant create a folder');
        }

        const filePath = `${dir}/signature.${renameImage(file.filename)}`;
        fs.rename(file.path, filePath, (err) => {
        if (err) {
            // Handle error appropriately and send an error response
            return res.status(500).send({ error: 'Failed to store the file' });
        }
        });
        console.log(filePath);
        await RegistrationDetail.updateOne({email},{
            signature: filePath
        });
        return res.status(200).send({message:'doc saved!'})

    }catch(err){
        return res.status(500).send({message: err.message})
    }
  }


  function renameImage(str){
    const name = str.split('.');
    return name[1];
  }


  exports.uploadExtra = async(req,res,next)=>{
    try{
        console.log('here',req.files[0]);
        const email = req.email;
        const file = req.files;
        const user = await RegistrationDetail.find({email});

        if(!user || user.lenghth <1){
            throw new Error('cant find the user');
        }
        const {program} = user[0];
        const dir = `src/files/registration/${program}/${email}`;

        //CREATE A FOLDER
        try{
            if(!fs.existsSync(`src/files/registration/${program}/${email}`)){
                fs.mkdirSync(`src/files/registration/${program}/${email}`);
            }
        }catch(err){
            throw new Error('Cant create a folder');
        }
        for(var i =0; i<req.files.length;i++){
            const filePath = `${dir}/${file[i].filename}`;
            fs.rename(file[i].path, filePath, (err) => {
                if (err) {
                    // Handle error appropriately and send an error response
                    return res.status(500).send({ error: 'Failed to store the file' });
                }
                });
        }
        // const filePath = `${dir}/${file.filename}`;
        // fs.rename(file.path, filePath, (err) => {
        // if (err) {
        //     // Handle error appropriately and send an error response
        //     return res.status(500).send({ error: 'Failed to store the file' });
        // }
        // });
        return res.status(200).send({ error: 'File saved' });

    }catch(err){

    }
  }


  exports.downloadForm = async(req,res,next)=>{
    try{
        const email = req.email;
        const user = await RegistrationDetail.find({email});
        if(!user || user.length <1){
            throw new Error('cant find the data');
        }
        const {program} = user[0];

        const fileDir = path.join('src','files','registration',`${program}`,`${email}`);
        const absPath = path.resolve(fileDir);
    
        const stream = fs.createReadStream(absPath+`/registration.pdf`);
        try{
            res.set({
                'Content-Disposition': `attachment; filename='registration.pdf'`,
                'Content-Type': 'application/pdf',
              });
              stream.pipe(res);

    }catch(err){
        return res.status(500).send({message: err.message});

    }
  }catch(err){
    return res.status(500).send({message: err.message});
  }
}



exports.tickDocs = async(req,res,next)=>{
    try{
        const {citizenship, equivalence,secondaryGradeSheet,
            secondaryCharacter, firstHighSchoolGradeSheet,
            secondHighSchoolGradeSheet, highSchoolCharacter,
            migration
        } = req.body;
        const email = req.email;
        const user = await RegistrationDetail.find({email});
        if(!user || user.lenghth <1){
            throw new Error('cant find the user');
        }
        await RegistrationDetail.updateOne({email},{
            equivalence,
            migration,
            citizenship,
            firstHighSchoolGradeSheet,
            secondHighSchoolGradeSheet,
            highSchoolCharacter,
            secondaryGradeSheet,
            secondaryCharacter
        });
        return res.status(200).send({message: 'Details Saved!'});
    }catch(err){
        return res.status(500).send({message: err.message});

    }
}