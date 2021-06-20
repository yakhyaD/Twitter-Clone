const passport = require("passport");
const express = require("express");
const { Conversation, Message } = require("../models/Chat");
const User = require("../models/User");

const router = express.Router();

router.get(
  "/conversations",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const conversations = await User.findOne(
        { username: req.user.username },
        { conversations: 1 }
      )
        .populate({
          path: "conversations",
          select: "participants updatedAt",
          options: { sort: { updateAt: -1 } },
          populate: {
            path: "messages",
            select: "content sender",
            populate: {
              path: "sender",
              model: "User",
              select: "username name profileImg",
            },
          },
        })
        .populate({
          path: "conversations",
          select: "participants updatedAt",
          options: { sort: { updateAt: -1 } },
          populate: {
            path: "participants",
            select: "username name user profileImg",
          },
        });
      res.status(200).json({ success: true, conversations });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ success: false, msg: "Error getting conversations" });
    }
  }
);
router.get(
  "/conversation",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const conversation = await User.findById(req.query.id).populate({
        path: "messsages",
        populate: {
          path: "sender",
          model: "User",
          select: "username name profileImg",
        },
      });
      if (!conversation) {
        res
          .status(404)
          .json({ success: false, msg: "Conversation does not exist" });
      } else {
        res.status(200).json({ success: true, conversation });
      }
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ success: false, msg: "Error getting conversation" });
    }
  }
);

router.post(
  "/conversation",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const sender = req.user._id;
    const recipient = req.body.id;
    try {
      const findChat = await Conversation.find({
        participants: { $all: [sender, recipient] },
      });
      //console.log(findChat, findChat.length)
      //check if a conversation already exist between this two
      if (findChat.length < 1) {
        const newConversation = await Conversation.create({
          participants: [sender, recipient],
        });
        const senderUser = await User.findById(req.user._id);
        const recipientUser = await User.findById(req.body.id);
        senderUser.conversations.unshift(newConversation);
        senderUser.save();
        recipientUser.conversations.unshift(newConversation);
        recipientUser.save();

        res
          .status(200)
          .json({ success: true, msg: "Conversation successfully created" });
      }
      // Conversation exist, send message
      if (findChat.length > 0 && req.body.content) {
        const newMessage = await Message.create({
          sender: req.user._id,
          content: req.body.content,
        });
        findChat[0].messages.push(newMessage);
        findChat[0].save();
        res.status(200).json({ success: true, msg: "Message sended" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, msg: "unknown server error" });
    }
  }
);
module.exports = router;
