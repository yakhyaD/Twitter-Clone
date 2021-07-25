const express = require("express");
const passport = require("passport");
const Tweet = require("../models/Tweet");
const User = require("../models/User");
const Hashtag = require("../models/Hashtag");

const router = express.Router();

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const newTweet = {
      body: req.body.body,
      name: req.user.name,
      username: req.user.username,
      images: req.body.images,
      parent: req.body.parent ?? null,
      user: req.user._id,
    };
    let hashtags = req.body.hashtags;
    try {
      const user = await User.findById(req.user._id);
      const tweet = await Tweet.create(newTweet);
      user.tweets.unshift(tweet);
      user.save();
      let parent;
      if (req.body.parent) {
        parent = await Tweet.findById(req.body.parent).populate(
          "user",
          "username name profileImage"
        );
        parent.replies.unshift(tweet);
        parent.save();
      }

      let hash;
      let newHash;
      if (hashtags) {
        for (let i = 0; i < hashtags.length; i++) {
          hash = await Hashtag.findOne({ content: hashtags[i] });
          if (!hash) {
            newHash = { content: hashtags[i] };
            hash = await Hashtag.create(newHash);
          }
          hash.tweets.unshift(tweet);
          hash.count = hash.count + 1;
          hash.save();
        }
      }
      let popTweet = tweet.toObject();
      popTweet.user = {
        username: user.username,
        name: user.name,
        profileImage: user.profileImg,
      };
      if (parent) {
        popTweet.parent = parent;
      }
      return res.status(200).json({
        success: true,
        msg: "Tweet successfully create",
        tweet: popTweet,
      });
    } catch (e) {
      res.status(400).json({ success: false, msg: "Error creating tweet" });
    }
  }
);

router.post(
  "/:id/like",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let user = await User.findById(req.user._id);
      let tweet = await Tweet.findById(req.params.id);
      if (
        user.likes.includes(req.params.id) ||
        tweet.likes.includes(req.user._id)
      ) {
        const index1 = user.likes.indexOf(req.params.id);
        if (index1 !== -1) {
          user.likes.splice(index1, 1);
        }
        const index2 = tweet.likes.indexOf(req.user._id);
        if (index2 !== -1) {
          tweet.likes.splice(index2, 1);
        }
        user.save();
        tweet.save();
        res.json({ msg: "Tweet Unliked" });
      } else {
        tweet.likes.push(user._id);
        user.likes.unshift(tweet._id);
        user.save();
        tweet.save();
        res.json({ msg: "Tweet Liked" });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: "Something went wrong" });
    }
  }
);
//bookmarks
router.post(
  "/:id/bookmarks",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let user = await User.findById(req.user._id);
      if (user.bookmarks.includes(req.params.id)) {
        const index = user.bookmarks.indexOf(req.params.id);
        if (index !== -1) user.bookmarks.splice(index, 1);
        user.save();
        res.json({ msg: "Tweet removed from bookmarks" });
      } else {
        user.bookmarks.unshift(req.params.id);
        user.save();
        res.json({ msg: "Tweet added to bookmarks" });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: "Something went wrong" });
    }
  }
);

//all tweets
router.get("/", async (req, res) => {
  try {
    let tweets = await Tweet.find()
      .populate("user", "username name profileImg createdAt")
      .sort({ createdAt: -1 })
      .populate({
        path: "parent",
        populate: { path: "user", select: "username profileImage name" },
      })
      .populate({
        path: "retweet",
        model: "Tweet",
        populate: { path: "user", select: "username profileImage   name" },
      })
      .populate({
        path: "parent",
        populate: { path: "parent", modal: "Tweet", select: "username" },
      });
    res.json({ succes: true, tweets });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Something went wrong" });
  }
});

//get one tweets
router.get("/:id", async (req, res) => {
  try {
    let tweet = await Tweet.findById(req.params.id)
      .populate({ path: "user", select: "username profileImg name" })
      .populate({
        path: "replies",
        populate: {
          path: "user",
          model: "User",
          select: "username profileImg name",
        },
      });

    res.json({ succes: true, tweet });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Something went wrong" });
  }
});
//retweet
router.post(
  "/:id/retweet",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let user = await User.findById(req.user._id);
      let tweet = await Tweet.findById(req.params.id);
      if (user.retweets.includes(req.params.id)) {
        // Delete user tweet retweet
        if (req.body.retweetId) {
          await Tweet.findOneAndDelete({ _id: req.body.retweetId });
        }
        await Tweet.findOneAndDelete({ retweet: req.params.id });

        let index = user.retweets.indexOf(req.params.id);
        if (index !== -1) user.retweets.splice(index, 1);
        const tweetIndex = tweet.likes.indexOf(req.params.id);
        if (tweetIndex !== -1) tweet.retweets.splice(tweetIndex, 1);
        user.save();
        tweet.save();
        res.json({ success: true, msg: "Retweet Removed" });
      } else {
        const newTweet = {
          user: req.user._id,
          retweet: tweet._id,
          username: req.user.username,
          name: req.user.name,
          description: `"retweeted from " ${tweet._id}`,
        };
        let retweet = await Tweet.create(newTweet);
        user.retweets.unshift(req.params.id);
        user.tweets.unshift(retweet);
        tweet.retweets.unshift(req.user._id);
        user.retweets.unshift(req.params.id);
        tweet.save();
        user.save();
        res.json({ success: true, msg: "Retweeted" });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: "Something went wrong" });
    }
  }
);
//delete
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const tweet = await Tweet.findById(req.params.id);
      if (tweet.user.toString() == req.user._id) {
        if (tweet.parent) {
          let parent = await Tweet.findById(tweet.parent);
          const index = parent.replies.indexOf(req.params.id);
          if (index !== -1) parent.replies.splice(index, 1);
        }
        await Tweet.findOneAndDelete(req.params.id);
        return res.json({ success: true, msg: "Tweet Deleted" });
      } else {
        return res.status(403).json({ msg: "Action Unauthorized" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Something went wrong!" });
    }
  }
);
module.exports = router;
