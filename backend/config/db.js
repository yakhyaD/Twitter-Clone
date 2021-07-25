const mongoose = require("mongoose");

const DBconnect = async () => {
  try {
    await mongoose.connect(process.env.DB_AUTH, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected");
  } catch (err) {
    console.log(err);
  }
};

module.exports = DBconnect;
