const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const registrationDetailSchema = new Schema({
    email:{
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    program:{
        type: String,
        enum:['BEELX','BESE','BECE','BEIT','BECIVIL','BCA','BBA','BARCH'],
        required: true
    },
    faculty:{
        type: String,
        required: true

    },
    level:{
        type: String,
        default: 'Bachelor',
        required: true

    },
    title: {
        type: String,
        enum: ['MR','MS','MRS'],
        required: true
    },

    fullName:{
        type:String,
        required: true,
        trim: true
    },
    fullNameDevanagari:{
        type: String,
        required: true,
        trim: true
    },
    dobNepali:{
        type: String,
        trim: true,
        required: true
    },
    dobEnglish:{
        type: String,
        trim: true,
        required: true
    },
    nationality:{
        type: String,
        default: 'Nepali',
        required: true,
        trim: true
    },
    religion:{
        type: String,
        trim: true,
        required: true
    },
    ethnicity:{
        type: String,
        trim: true,
        required: true
    },
    fatherName: {
        type: String,
        trim: true,
        required: true
    },
    motherName: {
        type: String,
        trim: true,
        required: true
    },
    wardNum:{
        type: String,
        required: true
    },
    townVillage:{
        type: String,
        required: true
    },
    district:{
        type: String,
        required: true
    },
    zone:{
        type: String,
        required: true
    },
    schoolName: {
        type: String,
        trim: true
    },
    secondaryBoard: {
        type:String,
        trim: true,
        required: true
    },
    secondaryYear:{
        type: String,
        trim: true
    },
    secondaryTotalMarks:{
        type: String,
    },
    secondaryMarksObtained: {
        type: String,
        trim: true,
        required: true
    },
    secondaryDivision:{
        type: String,
    },
    secondarySymbol:{
        type: String,
        trim: true
    },
    plusTwoName:{
        type: String,
        trim: true,
    },
    plusTwoBoard:{
        type: String,
        trim: true,
    },
    plusTwoYear:{
        type: String,
        trim: true,
        required: true
    },
    plusTwoTotalMarks:{
        type: String,
        required: true
    },
    plusTwoMarksObtained:{
        type: String,
        required: true
    },
    plusTwoDivision:{
        type: String
    },
    plusTwoSymbol:{
        type: String,
        trim: true
    },
    photoURL:{
        type: String,
        required: true
    },
    signature:{
        type: String,
        trim: true
    },
    citizenship:{
        type: Boolean,
        default: false
    },
    equivalence:{
        type: Boolean,
        default: false
    },
    secondaryGradeSheet:{
        type: Boolean,
        default: false
    },
    secondaryCharacter:{
        type: Boolean,
        default: false
    },
    firstHighSchoolGradeSheet:{
        type: Boolean,
        default: false
    },
    secondHighSchoolGradeSheet:{
        type: Boolean,
        default: false
    },
    highSchoolCharacter:{
        type: Boolean,
        default: false
    },
    migration:{
        type: Boolean,
        default: false
    },
    gender:{
        type: String,
        required: true,
        trim: true
    },
    plusTwoAddress:{
        type: String,
        trim: true
    },
    schoolAddress:{
        type: String,
        trim: true
    }
});


module.exports = mongoose.model('RegistrationDetail',registrationDetailSchema);