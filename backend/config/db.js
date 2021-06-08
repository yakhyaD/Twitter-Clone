const mongoose = require('mongoose');

const DBconnect = () => {
    mongoose.connect(
       process.env.DB_AUTH,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
        .then(() => console.log('DB connected'))
        .catch(err => console.log(err))
}

module.exports = DBconnect