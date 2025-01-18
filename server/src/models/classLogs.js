const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const classLogSchema = new Schema({
    teacher:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Teacher'
    },
    subject:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'CurrentSubject'
    },
    time:{
        type: String,
        required: true
    },
    shift:{
        type: String,
        required: true,
        enum:['Day','Morning','Combined','M1','M2']
    },
    mode:{
        type: String,
        enum: ['Lecture','Lab','Tutorial','Class Test'],
        required: true
    },
    timing:{
        type: String,
        required: true,
        enum:['On-Time','Late','Early-Exit','Absent']
    },
    type:{
        type: String,
        required: true,
        enum:['Regular','Swap','Replacement','Extra']
    },
    nepaliDate:{
        type: Date,
        required: true
    },
    englishDate:{
        type: Date,
        required: true
    },
    day:{
        type: String,
        required: true,
        enum:['Sun','Mon','Tue','Wed','Thurs','Fri','Sat']
    },
    faculty:{
        type: String,
        required: true,
        enum:['BEIT','BESE','BECE','BCA','BBA','BECIVIL','BARCH','BEELX']
    },
    topic:{
        type: String,
        trim: true
    },
    attendance:{
        type: Number,
        required: true
    },
    semester:{
        type: Number,
        required: true,
        enum:[1,2,3,4,5,6,7,8]
    },
    remark:{
        type: String,
        trim: true
    },
    lectureNum:{
        type: Number,
        required: true
    }
},
{timestamps: true}
);


module.exports = mongoose.model('ClassLogs',classLogSchema);