const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    currentSemester:{
        type: Number,
        min: 1,
        required: true
    },
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
        enum: ['admin','student'],
        default: 'student'
    },
    isFirstTime: {
        type: Boolean,
        default: true
    },
    rollNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    batch:{
        type:String,
        required: true
    },
    faculty:{
        type: String,
        enum:['BESE','BECE','BEIT','BECIVIL','BCA','BBA','BARCH'],
        // required: true
    },
    semester:{
        type: Number,
        min: 1
    },
    firstName:{
        type:String,
        required: true,
        trim: true
    },
    
    middleName:{
        type:String,
        default: ''
        },
    lastName:{
        type: String,
        required: true,
        trim: true
    },
    dobNepali:{
        type: String,
        trim: true
    },
    dobEnglish:{
        type: String,
        trim: true
    },
    nationality:{
        type: String
    },
    gender:{
        type: String,
        enum: ['Male','Female']
    },
    religion:{
        type: String
    },
    address:{
        type: String,
        trim: true
    },
    town:{
        type:String,
        trim: true
    },
    district:{
        type: String,
        trim: true
    },
    zone:{
        type: String,
        trim: true
    },
    wardNumber:{
        type: Number
    },
    studentContactNumber:{
        type: String,
        trim: true
    },
    fatherContactNumber: {
        type: String,
        trim: true
    },
    motherContactNumber:{
        type: String,
        trim: true
    },
    localGuardianContactNumber:{
        type: String,
        trim: true
    },
    imageurlPath:{
        type: String, 
        default: null
    },
    imagecontentType:{
        type:String,
        default: 'image/jpeg'
    },
    examRollNumber:{
        type: String,
        trim: true
    },
    puRegistrationNumber:{
        type: String,
        default:' '
    },
    signatureUrl:{
        type: String, 
        trim:true,
        default:null
    },
    signaturecontentType:{
        type:String,
        default: 'image/jpeg'
    },
    formSubmitted:{
        type: Boolean,
        default: false
    },
    submittedOn:{
        type: Date
    }
});


module.exports = mongoose.model('User',userSchema);