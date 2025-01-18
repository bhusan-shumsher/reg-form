// THIS MODEL IS FOR CLASS LOGS PURPOSE


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lessonPlan = new Schema({
    lecture:{
        type: Number,
        required: true
    },
    topic:{
        type: String,
        require: true
    },
    unit:{
        type: String
    },
    isComplete:{
        type: Boolean,
        default:false
    }
})
const  currentSubjectSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    shortName:{
        type: String,
        required: true
    },
    faculty:{
        type: String,
        required: true,
        enum:['BCA','BBA','BESE','BEIT','BEELX','BECE','BECIVIL','BARCH']
    },
    courseCode:{
        type: String,
        required: true
    },
    semester:{
        type: Number,
        required: true,
        enum:[1,2,3,4,5,6,7,8]
    },
    shift:{
        type: String,
        required: true,
        enum: ['Day','Morning','Combined','M1','M2']
    },
    teacher:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Teacher'
    },
    lessonPlan:{
        type: [lessonPlan]
    }
});


module.exports = mongoose.model('CurrentSubject',currentSubjectSchema);