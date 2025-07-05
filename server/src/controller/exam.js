
const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");
const User = require('../models/user');
const util = require('../utils/array-padding');
const Triplicate = require('../models/triplicate');
const basePath = '/usr/app/src/files/submitted-form';

exports.generateForm = async (req,res,next)=>{
try{

    
// get roll number
const {rollNumber,faculty} = req; 
// get current sem, ern 
const data = await User.aggregate([
    {$match:{rollNumber}},
    {$lookup:{
        from: 'results',
        localField: 'rollNumber',
        foreignField: 'rollNumber',
        as: 'examRollNumber'
    }},
    {$set:{
        examRollNumber: {
            $arrayElemAt: ['$examRollNumber.examRollNumber',0]
        }
    }}
]);
if(!data){
    res.status(500).send({message: 'cant process now'});
}
console.log('DATA',data[0]);
if(data[0].imageurlPath === null || data[0].imageurlPath === undefined){
    throw new Error('Upload Photo!!');
}
if(data[0].signatureUrl === null || data[0].signatureUrl === undefined){
    throw new Error('Upload signature !!');
}
let bothCoreAndElective = req.body.formData.regularSubjects.concat(req.body.formData.elective);
const date = new Date();
const dateStamp = date.getDate() + '-' + (date.getMonth() +1) +'-' + date.getFullYear();
// const regularSubjects = util.arrayPadding(req.body.formData.regularSubjects,10);
const regularSubjects = util.arrayPadding(bothCoreAndElective,10);

const backSubjects = util.arrayPadding(req.body.formData.backSubjects, 8);
const newData = new Object();
// ADJUSTMENT FOR BBA
var PROGRAM = 'Science & Technology';
if(data[0].faculty === 'BBA'){
	PROGRAM = 'Management';
}
newData.backSubjects = backSubjects;
newData.regularSubjects = regularSubjects;
if(Array.isArray(backSubjects) && !backSubjects.length){
    newData.allSubjects = removeEmptyObjects(regularSubjects);

}else{
    newData.allSubjects = removeEmptyObjects(regularSubjects).concat(renameKey(removeEmptyObjects(backSubjects)));

}
newData.firstName = data[0].firstName.toUpperCase();
newData.lastName = data[0].lastName.toUpperCase();
newData.middleName = data[0].middleName.toUpperCase();
newData.faculty = data[0].faculty;
newData.examRollNumber = data[0].examRollNumber;
// DATE OF BIRTH
newData.dob = data[0].dobEnglish;
// newData.totalBackDue = removeEmptyObjects(backSubjects).length * 500;
newData.date = dateStamp;
// newData.image = `data:${data[0].image.contentType};base64,${toBase64(data[0].image.urlPath)}`;
newData.image = `data:${data[0].imagecontentType};base64,${toBase64(data[0].imageurlPath)}`;

newData.puRegistrationNumber = data[0].puRegistrationNumber;
// newData.image = logoToBase64('src/template/logo.jpg');
newData.logo = logoToBase64('src/template/logo.jpg');
// newData.signature = `data:${data[0].signature.contentType};base64,${toBase64(data[0].signature.sign)}`;
newData.signature = `data:${data[0].signaturecontentType};base64,${toBase64(data[0].signatureUrl)}`;

newData.khakurel = logoToBase64('src/template/khakurel.png');
newData.fullName = addSpace(combineName(data[0].firstName, data[0].middleName, data[0].lastName));
newData.puFormat = formatRegistration(data[0].puRegistrationNumber);
newData.PROGRAM = PROGRAM;
const templateHtml = fs.readFileSync(path.join(process.cwd(), 'src/template/finalEntrance.html'), 'utf8');
    handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});
// Course Registration
const subRegHtml = fs.readFileSync(path.join(process.cwd(), 'src/template/courseRegistration.html'), 'utf8');
    handlebars.registerHelper("inc", function(value, optionSub)
{
    return parseInt(value) + 1;
});
//Filled by College
const secondaryHtml = fs.readFileSync(path.join(process.cwd(), 'src/template/subReg.html'), 'utf8');
    handlebars.registerHelper("inc", function(value, optionSub)
{
    return parseInt(value) + 1;
});
// application form 
const applicationHtml = fs.readFileSync(path.join(process.cwd(), 'src/template/applicationForm.html'), 'utf8');
    handlebars.registerHelper("inc", function(value, optionSub)
{
    return parseInt(value) + 1;
});
// HERE IS WHAT IT TAKES ..CRITICAL
var template = handlebars.compile(templateHtml);
	var html = template(newData);

    var pdfPath = path.join('form');
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
  	// executablePath: '/usr/bin/chromium',

		headless: 'new'
	});
    var page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.emulateMediaType('screen');
 
    // create a folder 

    const targetDir = path.join(basePath, faculty, data[0].email);
    
    try{
        // if(!fs.existsSync(`src/files/submitted-form/${faculty}/${data[0].email}`)){
        //     fs.mkdirSync(`src/files/submitted-form/${faculty}/${data[0].email}`,{recursive: true});
        // }
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
    }catch(err){
        console.log(err)
    }

    // Downlaod the PDF
 const pdfPth = path.join(basePath, faculty, data[0].email, `${faculty}-${rollNumber}-entrance.pdf`);

  const pdf = await page.pdf({
    path: pdfPth,
    margin: { top: '10px', right: '50px', bottom: '10px', left: '50px' },
    printBackground: true,
    format: 'A4',
  });

//   Close the browser instance
//   await browser.close();

  // duplicate code 
  var template = handlebars.compile(subRegHtml);
	var html = template(newData);

    var pdfPath = path.join('form');
    //THIS IS browserTwo
//     const browserTwo = await puppeteer.launch({
//         args: ['--no-sandbox'],
//   // executablePath: '/usr/bin/chromium',

// 		headless: 'new'
// 	});
    // THIS IS browserTwo
    var page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.emulateMediaType('screen');
 

    
    // create a folder 
    try{
        // if(!fs.existsSync(`src/files/submitted-form/${faculty}/${data[0].email}`)){
        //     fs.mkdirSync(`src/files/submitted-form/${faculty}/${data[0].email}`,{recursive: true});
        // }
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
    }catch(err){
        console.log(err)
    }

    const pdfPath2 = path.join(basePath, faculty, data[0].email, `${faculty}-${rollNumber}-courseReg.pdf`);

    // Downlaod the PDF
  const pdfTwo= await page.pdf({
    path: pdfPath2,
    margin: { top: '10px', right: '50px', bottom: '10px', left: '50px' },
    printBackground: true,
    format: 'A4',
  });
//AGAIN DUP CODE
var template = handlebars.compile(secondaryHtml);
	var html = template(newData);

    // var pdfPath = path.join('form');
//     const browserThree = await puppeteer.launch({
//         args: ['--no-sandbox'],
//   // executablePath: '/usr/bin/chromium'

// 		headless: 'new'
// 	});
// THIS IS broswerThree
    var page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.emulateMediaType('screen');
 
    // create a folder 
    console.log(__dirname);
    try{
        // if(!fs.existsSync(`src/files/submitted-form/${faculty}/${data[0].email}`)){
        //     fs.mkdirSync(`src/files/submitted-form/${faculty}/${data[0].email}`,{recursive: true});
        // }
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
    }catch(err){
        console.log(err)
    }

    const pdfPath3 = path.join(basePath, faculty, data[0].email, `${faculty}-${rollNumber}-cllgFill.pdf`);

    // Downlaod the PDF
  const pdfThree = await page.pdf({
    path: pdfPath3,
    margin: { top: '10px', right: '50px', bottom: '10px', left: '50px' },
    printBackground: true,
    format: 'A4',
  });
  // SUPER DUPLICATE CODE -NEED TO REFACTOR
  var template = handlebars.compile(applicationHtml);
	var html = template(newData);

    // var pdfPath = path.join('form');
    // const browserFour = await puppeteer.launch({
    //     args: ['--no-sandbox'],
	//       // executablePath: '/usr/bin/chromium',

	// 	headless: 'new'
	// });

    // THIS IS browserFour
    var page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.emulateMediaType('screen');
 
    // create a folder 
    console.log(__dirname);
    try{
        // if(!fs.existsSync(`src/files/submitted-form/${faculty}/${data[0].email}`)){
        //     fs.mkdirSync(`src/files/submitted-form/${faculty}/${data[0].email}`,{recursive: true});
        // }
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
    }catch(err){
        console.log(err)
    }

    const pdfPath4 = path.join(basePath, faculty, data[0].email, `${faculty}-${rollNumber}-appl.pdf`);

    // Downlaod the PDF
  const pdfFour = await page.pdf({
    path: pdfPath4,
    margin: { top: '10px', right: '50px', bottom: '10px', left: '50px' },
    printBackground: true,
    format: 'A4',
  });
//   Close the browser instance
  await browser.close();
//   await browserTwo.close();
//   await browserThree.close();
//   await browserFour.close();

  // rename folder 
  try{
    const originalPath = path.join(basePath, faculty, data[0].email);
    const renamedPath = path.join(basePath, faculty, `${data[0].email}-OK`);
    // fs.renameSync(`src/files/submitted-form/${faculty}/${data[0].email}`,`src/files/submitted-form/${faculty}/${data[0].email}-OK`)
    fs.renameSync(originalPath, renamedPath);

  }catch(err){
    console.log('RENAMING IS FUCKED');
  }
// const triplicate = new Triplicate({
//     semester: data[0].currentSemester,
//     faculty :data[0].faculty,
//     rollNumber: data[0].rollNumber,
//     examRollNumber: data[0].examRollNumber,
//     puRegistrationNumber: data[0].puRegistrationNumber,
//     backSubjects: req.body.formData.backSubjects,
//     regularSubjects: req.body.formData.regularSubjects,
//     backCount: req.body.formData.backSubjects.length
// });
// await triplicate.save();

 await User.updateOne({rollNumber},{$set:{formSubmitted: true,submittedOn: new Date()}});

  return res.status(200).send({message:'success !'});
}catch(err){
    return res.status(501).send({message: err.message});
}
}



exports.downloadForm = async (req,res,next)=>{
    const {rollNumber,faculty,email} = req;
    const fileDir = path.join('src','files','submitted-form',`${faculty}`,`${email}-OK`);
    const absPath = path.resolve(fileDir);

    const stream = fs.createReadStream(absPath+`/${faculty}-${rollNumber}-entrance.pdf`);
    try{
        res.set({
            'Content-Disposition': `attachment; filename='hello.pdf'`,
            'Content-Type': 'application/pdf',
          });
          stream.pipe(res);
    
    }catch(err){
        console.log(err)
    }
}


const renameKey= (back)=>{
    back = back.map(function (obj) {
 
        // Assign new key
        obj['subjectName'] = obj['subject'];
        // Delete old key
        delete obj['subject']; 
        obj['remark'] = 'Retake';
        return obj;
    });
    return back;
}

// remove empty object

function removeEmptyObjects(array) {
    const newArray = array.filter(element => {
      if (Object.keys(element).length !== 0) {
        return true;
      }
  
      return false;
    });
  
    return newArray;
  }
  


// const toBase64=(data)=>{
//     console.log('lado',data);
//     // const base64 = btoa(String.fromCharCode(... new Uint8Array(data)));
//     return Buffer.from(data).toString('base64')
    
// }

function logoToBase64(filePath) {
    const img = fs.readFileSync(filePath);
  
    return 'data:image/png;base64,'+ Buffer.from(img).toString('base64');
  }

  function toBase64(filePath) {
    const img = fs.readFileSync(filePath);
  
    return  Buffer.from(img).toString('base64');
  };



function addSpace(str) {
    console.log(str.split(' ').join('   '));
    return str.split(' ').join('  ');
  }

  function combineName(first,middle,last){
     var fullName = first.concat(" ",middle).concat(" ",last);
      console.log(fullName);
     return fullName.toUpperCase();
  }

  function formatRegistration(str){
    
    if(str.length >2){
        return str.split('');
    }else{
        var arr =[];
        for(let i =0; i < 17; i++){
            arr.push[' '];
        }
        return arr;
    }

  }
