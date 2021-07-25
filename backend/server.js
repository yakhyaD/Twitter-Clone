const express = require("express");
const cors = require("cors");
const DBconnect = require("./config/db");
const passport = require("passport");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const methodOverride = require("method-override");
const jwtDecode = require("jwt-decode");
dotenv.config();

require("./config/passport");

DBconnect();
mongoose.set("useCreateIndex", true);

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "http://localhost:3000" },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

//routes handlers
const authRoutes = require("./routes/auth");
const tweetRoutes = require("./routes/tweet");
const userRoutes = require("./routes/user");
const listRoutes = require("./routes/list");
const trendRoutes = require("./routes/trend");
const chatRoutes = require("./routes/chat");
//const uploadFile = require('./routes/handleUpload')
const upload = require("./config/uploadImage");

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/auth", authRoutes);
app.use("/tweet", tweetRoutes);
app.use("/user", userRoutes);
app.use("/list", listRoutes);
app.use("/trend", trendRoutes);
app.use("/chat", chatRoutes);
// app.post('/upload', async (req, res) => {
//   try {
//     await upload(req, res);

//     console.log(req.file);
//     if (req.file == undefined) {
//       return res.send(`You must select a file.`);
//     }

//     return res.send(`File has been uploaded.`);
//   } catch (error) {
//     console.log(error);
//     return res.send(`Error when trying upload image: ${error}`);
//   }
// })

const { Conversation } = require("./models/Chat");
const { Message } = require("./models/Chat");

io.use((socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    /* jwt.verify(process.env.SECRET_TOKEN, (err, decoded) => {
      if (err) return next(new Error("Authentication error"));
      socket.decoded = decoded;
      next();
    }); */
    socket.decoded = jwtDecode(socket.handshake.query.token);
    next();
  } else {
    next(new Error("Authentication error"));
  }
});
io.on("connection", (socket) => {
  socket.on("subscribe", (room) => {
    socket.join(room);
  });
  socket.on("leaveRoom", (room) => {
    socket.leave(room);
  });
  socket.on("chat", async (msg) => {
    const recipient = msg.id;
    const sender = socket.decoded.id;
    try {
      const findChat = await Conversation.find({
        participants: { $all: [sender, recipient] },
      });
      //console.log(findChat, findChat.length)
      //check if a conversation already exist between this two
      if (findChat.length < 1) {
        console.log("doesn't exist");
        const firstMessage = await Message.create({
          sender: req.user._id,
          content: req.body.content,
        });
        const newConversation = await Conversation.create({
          participants: [sender, recipient],
        });
        const senderUser = await User.findById(msg.id);
        const recipientUser = await User.findById(socket.decoded.id);
        senderUser.conversations.unshift(newConversation);
        senderUser.save();
        recipientUser.conversations.unshift(newConversation);
        await recipientUser.save();
        newConversation.messages.push(firstMessage);
        const doc = await newConversation.save();
        console.log("doc:", doc);
        return socket.broadcast.to(msg.room).emit("output", doc.messages);
      }
      // Conversation exist, send message
      else if (findChat.length > 0) {
        const newMessage = await Message.create({
          sender: socket.decoded.id,
          content: msg.content,
        });
        findChat[0].messages.push(newMessage);
        let popMsg = await newMessage
          .populate("sender", "name username", "createdAt")
          .execPopulate();
        await findChat[0].save();
        return io.in(msg.room).emit("output", popMsg);
      } else {
        return io.emit("error sending message");
      }
    } catch (err) {
      console.log(err);
      return io.emit("unknow server error");
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`server runnig on port ${PORT}`));
