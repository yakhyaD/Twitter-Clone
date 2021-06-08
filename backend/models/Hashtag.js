const mongoose = require('mongoose')
const Schema = mongoose.Schema

const hashtagSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        default: 0
    },
    tweets: [{
        type: Schema.Types.ObjectId,
        ref: 'Tweet'
    }]
}, {timestamp: true})

const Hashtag = mongoose.model('Hashtag', hashtagSchema)
module.exports = Hashtag