// THIS MODEL IS FOR CLASS LOGS PURPOSE


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const  electiveSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    courseCode:{
        type: String,
        required: true
    },
    creditHour:{
        type: Number,
        min: true,
        required: true
    }
});


module.exports = mongoose.model('Elective',electiveSchema);