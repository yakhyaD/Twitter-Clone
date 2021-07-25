const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tweetSchema = new Schema(
  {
    body: {
      type: String,
      required: false,
      default: "",
    },
    image: {
      type: Array,
      default: [],
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
    tweets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
      },
    ],
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
      },
    ],
    retweets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
      },
    ],
    user: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    thread: {
      type: Array,
      default: [],
    },
    username: {
      type: String,
    },
    name: {
      type: String,
    },
    retweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamp: true }
);

const Tweet = mongoose.model("Tweet", tweetSchema);
module.exports = Tweet;
