const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");

router.post("/signup", (req, res) => {
  const { username, name, email, password } = req.body;
  const newUser = { username, name, email, password };

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        User.findOne({ email })
          .then((user) => {
            if (!user) {
              bcrypt.hash(password, 10, (err, hash) => {
                newUser.password = hash;
                User.create(newUser)
                  .then(() =>
                    res.status(201).json({ msg: "User successfully created" })
                  )
                  .catch((err) => res.status(400).json(err));
              });
            } else {
              throw new Error("Email is already");
              //res.json({msg: 'Email already used'})
            }
          })
          .catch((error) => res.status(400).json(error));
      } else {
        throw new Error("Username already exists");
        //res.json({msg: 'Username already exits'})
      }
    })
    .catch((error) => res.status(400).json(error));
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        msg: info ? info.message : "Login Failed",
        user,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        return res.status(400).json(err);
      }
      let userData = {
        id: user._id,
        admin: user.admin,
        username: user.username,
      };
      const token = jwt.sign(userData, "Bearer", { expiresIn: 60 * 60 * 60 });

      return res.status(201).json({ token });
    });
  })(req, res);
});

router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findOne(
        {
          username: req.user.username,
        },
        {
          name: 1,
          username: 1,
          profileImg: 1,
          banner: 1,
          followers: 1,
          following: 1,
          bookmarks: 1,
          theme: 1,
          likes: 1,
          retweets: 1,
        }
      );
      return res.status(200).json({ user });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, msg: "Account not founded" });
    }
  }
);

module.exports = router;
