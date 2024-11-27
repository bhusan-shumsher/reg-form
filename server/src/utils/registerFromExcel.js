const xlsx = require('xlsx');
// ONLY FOR NEW STUDENTS FOR PU REGISTRATION

exports.registerBulk = (filepath,faculty)=>{
    try{
        const file = xlsx.readFile(filepath);
        const sheetName = file.SheetNames;
        let parsedData = [];
          // Convert to json using xlsx
          const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetName]);
          parsedData.push(...tempData);
        let student = [];
        parsedData.forEach(data=>{
            student.push(createNewStudent(data['Email Address'],faculty));
      })
      return student;
    }catch(err){
        console.log(err.message);
        throw new Error('Problem with uploaded file')
    }
}

const createNewStudent = (data,faculty)=>{
    const record = new Object();
    record.email = data;
    record.faculty = faculty;
    record.password = Math.random().toString(36).substring(2,8); //generate random password
    return record;
}

function extractRoll(email){
    
    var roll = email.split('@')[0].split('.')[1];
    return roll;
}