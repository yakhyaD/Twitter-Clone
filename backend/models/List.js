const mongoose = require('mongoose')
const Schema = mongoose.Schema

const listSchema = new Schema({
    name: {
        type: String,
        required: true,
        default: ""
    },
    description: {
        type: String,
        required: true,
        default: ""
    },
    banner: {
        required: false,
        default: "https://pbs-o.twimg.com/media/EXZ3BXhUwAEFNBE?format=png&name=small",
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    tweets: [{
        type: Schema.Types.ObjectId,
        ref: 'Tweet'
    }],
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {timestamp: true})

const List = mongoose.model('List', listSchema)
module.exports = List