const express = require("express");
const Hashtag = require("../models/Hashtag");
const Tweet = require("../models/Tweet");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const hashtags = await Hashtag.find().limit(12).sort({ count: -1 }).exec();
    res.status(200).json({ success: true, trends: hashtags });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Unknown server error" });
  }
});
router.get("/:hashtag", async (req, res) => {
  let param = "#" + req.params.hashtag;
  try {
    const hashtags = await Hashtag.findOne({ content: param })
      .populate({
        path: "tweets",
        populate: {
          path: "user",
          select: "username profileImg name",
        },
      })
      .populate({
        path: "tweets",
        populate: {
          path: "parent",
          populate: {
            path: "user",
            model: "User",
            select: "username profileImg name",
          },
        },
      });

    res.status(200).json({ success: true, result: hashtags });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Unknown server error" });
  }
});

// search user
router.post("/", async (req, res) => {
  try {
    const result = await Tweet.find({
      $or: [
        { description: new RegExp(req.body.description, "i") },
        { name: new RegExp(req.body.description, "i") },
        { username: new RegExp(req.body.description, "i") },
      ],
    })
      .populate("user", "username name profileImage")
      .populate({
        path: "parent",
        populate: {
          path: "user",
          model: "User",
          select: "username name profileImage",
        },
      })
      .populate({
        path: "retweets",
        populate: {
          path: "user",
          model: "User",
          select: "username name profileImage",
        },
      })
      .limit(15)
      .exec();

    res.status(200).json({ success: true, result });
  } catch (err) {
    console.log(err);
    res.json({ success: false, msg: "Error in searching users" });
  }
});

module.exports = router;
