const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.get("/:username", async (req, res) => {
  let decoded;
  try {
    const token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : null;
    decoded = token ? jwt.verify(token, process.env.SECRET_KEY) : { id: null };
  } catch (err) {
    decoded = { id: null };
  }

  try {
    let user;
    user = await User.findOne(
      { username: req.params.username },
      { email: 0, password: 0 }
    )
      .populate("tweets")
      .populate({
        path: "tweets",
        populate: {
          path: "user",
          model: "User",
          select: "username profileImg name",
        },
      })
      .populate("likes")
      .populate({
        path: "likes",
        populate: {
          path: "user",
          model: "User",
          select: "username profileImg name",
        },
      })
      .populate("posts")
      .populate({
        path: "posts",
        populate: {
          path: "user",
          model: "User",
          select: "username profileImg name",
        },
      });

    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.log(err);
    res.status(404).json({ success: false, msg: "User not founded" });
  }
});
router.post(
  "/:id/follow",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const userToFollow = await User.findById(req.params.id);
      if (user.following.includes(req.params.id)) {
        const userIndex = user.following.indexOf(req.params.id);
        if (userIndex !== -1) user.following.splice(userIndex, 1);
        const userToFollowIndex = userToFollow.followers.indexOf(req.user._id);
        if (userToFollowIndex !== -1)
          userToFollow.followers.splice(userToFollowIndex, 1);
        user.save();
        userToFollow.save();
        return res.json({ success: true, msg: "User Unfollowed" });
      } else {
        user.following.unshift(req.params.id);
        userToFollow.followers.unshift(req.user._id);
        user.save();
        userToFollow.save();
        return res.json({ success: true, msg: "User Followed" });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, msg: "Error following user" });
    }
  }
);
router.get("/:username/tweets", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate({
        path: "tweet likes retweets",
        populate: {
          path: "user",
          model: "User",
          select: "username profileImage name",
        },
      })
      .populate({
        path: "tweet likes retweets",
        populate: {
          path: "parent",
          populate: {
            path: "user",
            model: "User",
            select: "username profileImage name",
          },
        },
      })
      .populate({
        path: "tweet likes retweets",
        populate: {
          path: "retweet",
          populate: {
            path: "user",
            model: "User",
            select: "username profileImage name",
          },
        },
      });
    res.json({ success: true, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Something went wrong" });
  }
});

//get bookmarks
router.get(
  "/:username/bookmarks",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findOne(
        { username: req.params.username },
        { bookmarks: 1 }
      )
        .populate({
          path: "bookmarks",
          populate: {
            path: "user",
            model: "User",
            select: "username profileImg name",
          },
        })
        .populate({
          path: "bookmarks",
          populate: {
            path: "parent",
            populate: {
              path: "user",
              model: "User",
              select: "username profileImg name",
            },
          },
        });
      res.json({ success: true, bookmarks: user.bookmarks });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, msg: "Error getting bookmarks" });
    }
  }
);
//get lists
router.get(
  "/:username/lists",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findOne(
        { username: req.params.username },
        { lists: 1 }
      ).populate({
        path: lists,
        populate: {
          path: "lists",
          model: "List",
          select: "name banner",
        },
      });

      return res.json({ success: true, user });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, msg: "Error getting lists" });
    }
  }
);

//Modify user profile details
router.put(
  "/:username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userDetails = {
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      profileImg: req.body.profileImg,
      banner: req.body.banner,
      theme: req.body.theme,
    };
    Object.keys(userDetails).forEach((key) =>
      userDetails[key] == null || userDetails[key] === ""
        ? delete userDetails[key]
        : null
    );
    try {
      await User.findOneAndUpdate(req.params.username, userDetails, {
        useFindAndModify: false,
      });
      res.json({ success: true, msg: "User successfully updated" });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ success: true, msg: "Cannot update user details" });
    }
  }
);
// search user
router.post("/", async (req, res) => {
  try {
    const UsersFounded = await User.find(
      {
        $or: [
          { username: new RegExp(req.body.username, "i") },
          { name: new RegExp(req.body.username, "i") },
        ],
      },
      { username: 1, name: 1, profileImg: 1, description: 1 }
    ).exec();

    res.json({ success: true, result: UsersFounded });
  } catch (err) {
    console.log(err);
    res.json({ success: false, msg: "Error in searching users" });
  }
});
// get user followers
router.get(
  "/:username/followers",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findOne(
        { username: req.params.username },
        { followers: 1, following: 1 }
      )
        .populate({
          path: "followers",
          select: "name username profileImage description",
        })
        .populate({
          path: "following",
          select: "name username profileImage description",
        });
      if (user) {
        res.json({ success: true, user: user });
      } else {
        res.json({ success: true, msg: "User does not exist" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, msg: "Errors getting followers" });
    }
  }
);
// get user suggestions
router.get(
  "/:username/suggestions",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const users = await User.find(
        { _id: { $nin: req.user.following } },
        { profileImg: 1, username: 1, name: 1 }
      ).limit(5);
      res.json({ success: true, suggestions: users });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ success: false, msg: "Errors getting suggestions" });
    }
  }
);

module.exports = router;
