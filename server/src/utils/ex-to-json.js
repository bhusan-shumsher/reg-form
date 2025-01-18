const xlsx = require('xlsx');
exports.ex2json = (filepath)=>{
    try{
        const file = xlsx.readFile(filepath);
        const sheetName = file.SheetNames;
        // Variable to store our data
      let parsedData = [];
    
      // Loop through sheets
    //   for (let i = 0; i < totalSheets; i++) {
    
          // Convert to json using xlsx
          const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetName]);
          // Skip header row which is the colum names
        //   tempData.shift();
          // Add the sheet's json to our data array
          parsedData.push(...tempData);
          return parsedData;
    //   return student;
    }catch(err){
        throw new Error('Problem with uploaded file')
    }
}

