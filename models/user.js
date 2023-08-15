const mongoose = require('mongoose')
// const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    profilePicUrl: {
        type: String,
        required: false
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
})

UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'emailAddress' // Use 'emailAddress' as the username field
});

const User = mongoose.model('User', UserSchema);
module.exports = User;