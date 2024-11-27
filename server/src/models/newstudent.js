const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const newStudentSchema = new Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password :{
        type: String,
        required: true,
        trim: true
    },
    role:{
        type:String,
        require: true,
        enum: ['newstudent'],
        default: 'newstudent'
    },
    hasSubmitted:{
        type: Boolean,
        default: false
    },
    faculty:{
        type: String,
        required: true,
        enum:['BESE','BEIT','BECE','BECIVIL','BARCH','BBA','BCA']
    }
});


module.exports = mongoose.model('newStudent',newStudentSchema);