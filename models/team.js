const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TeamSchema = new mongoose.Schema({
    badgeUrl: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    nickname: {
        type: String,
        required: true
    },
    founded: {
        type: Number,
        required: true
    },
    groundName: {
        type: String,
        required: true
    },
    groundCapacity: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    league: {
        type: String,
        required: true
    },
    coach: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Team', TeamSchema)