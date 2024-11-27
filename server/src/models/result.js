const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resultSchema = new Schema({
   semester:{
      type: Number,
      min: 1,
      required: true
   },
   year:{
      type: Number,
      required: true
   },
   faculty:{
      type: String,
      required: true,
      enum:['BECE','BESE','BEELX','BCA','BECIVIL','BEIT','BBA']
   },
   semesterType:{
      type: String,
      enum: ['FALL','SPRING'],
      required: true
   },
   rollNumber:{
    type: String,
    required: true,
    trim: true
   },
   examRollNumber:{
    type: String,
    required: true,
    trim: true
   },
   sgpa: {
    type: Number,
    default: 0.0,
   },
   puRegistrationNumber:{
      type: String,
      trim: true
   },
   grades: [
     {
        subject: {type:String,trim:true},
        grade: {type: String,trim:true},
        courseCode: {type: String,trim:true},
        creditHour:{type: String,trim:true}
     }
   ]
});


module.exports = mongoose.model('Result',resultSchema);
