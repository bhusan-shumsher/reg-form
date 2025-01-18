const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const teacherSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    nameCode:{
        type: String,
        required: true
    },
    position:{
        type: String,
        required: true
    },
    isFullTime:{
        type: Boolean,
        required: true,
        default: true
    },
    title:{
        type: String,
        required: true
    },
    shift:{
        type: String,
        required: true,
        enum: ['Morning','Day']
    },
    subjects:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CurrentSubject'
        }
    ]
});


module.exports = mongoose.model('Teacher',teacherSchema);