const xlsx = require('xlsx');

exports.ex2json = (filepath)=>{
    // Read the file using pathname
  const file = xlsx.readFile(filepath);

  // Grab the sheet info from the file
  const sheetNames = file.SheetNames;
  const totalSheets = sheetNames.length;

  // Variable to store our data
  let parsedData = [];

  // Loop through sheets
  for (let i = 0; i < totalSheets; i++) {

      // Convert to json using xlsx
      const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[i]]);

      // Skip header row which is the colum names
    //   tempData.shift();

      // Add the sheet's json to our data array
      parsedData.push(...tempData);
}
let subjects = []
parsedData.forEach(data=>{
    subjects.push(createDepartmentRecord(data));
});
return subjects;
}

const createDepartmentRecord = (data)=>{
    const record = new Object();
    record.faculty = data['Department'];
    record.semester = data['Semester'];
    record.courseCode = data['Code'];
    record.subjectName = data['Name'];
    record.creditHour = data['Credit'];
    if(data['Concurrent'] !== undefined){
        record.isConcurrent = true;
        record.concurrentCode = data['Concurrent'];
    };
    if(data['Prerequisite'] !== undefined){
        record.hasPrerequisite = true;
        record.prerequisiteCode = data['Prerequisite'];
    };
    return record;
}