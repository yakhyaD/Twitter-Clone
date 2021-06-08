const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    username:{
        default: "",
        required: true,
        unique: true,
        type: String
    },
    name:{
        default: "",
        required: true,
        type: String
    },
    email:{
        required: true,
        type: String,
        unique: true
    },
    password:{
        required: true,
        type: String,
    },
    description:{
        default: "",
        required: false ,
        type: String
    },
    profileImg:{
        default: "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg",
        required: false ,
        type: String
    },
    banner:{
        default: "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg",
        required: false,
        type: String
    },
    location:{
        default: "",
        required: false ,
        type: String
    },
    following:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    followers:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    tweets:[{
        type:Schema.Types.ObjectId,
        ref:'Tweet'
    }],
    retweets:[{
        type:Schema.Types.ObjectId,
        ref:'Tweet'
    }],
    likes:[{
        type:Schema.Types.ObjectId,
        ref:'Tweet'
    }],
    bookmarks:[{
        type:Schema.Types.ObjectId,
        ref:'Tweet'
    }],
    lists:[{
        type:Schema.Types.ObjectId,
        ref:'List'
    }],
    notifications:{
        required: false,
        default: [],
        type: Array
    },
    theme: {
        type: String,
        default: 'light'
    },
    conversations:[{
        type:Schema.Types.ObjectId,
        ref:'Conversation'
    }]

})
const User = mongoose.model('User', userSchema)

module.exports = User