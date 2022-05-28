const mongoose = require('mongoose');
const { regEmail, regWord } = require('../controlers/regExes');
// let regWord = /^[a-zA-Z0-9]{5}[a-zA-Z0-9]*\s*\w*/;

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate: {
            validator: v => regEmail.test(v),
            message: props => `${props.value} is not a valid User Name`
        }
    },
    password: {
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
    info:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "InfoUser"
    },
    partner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Partner"
    },
    createdAt: {
        type: Date,
        required: true,
        // inmutable: true,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date,
        required: true,
        default: () => Date.now(),
    },
})

module.exports = mongoose.model('Users', userSchema)
