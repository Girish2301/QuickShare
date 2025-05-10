const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    fileName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    uuid: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
},
{
    timeStamps: true
});

module.exports = mongoose.model('files', fileSchema);