/* const { projectStorage, projectFirestore } = require('./firebaseConfig')


const fileFilter = (file) => {
  if(!(file.type === 'image/jpeg' || file.mimetype === 'image/png' || file.type === 'image/gif')){
    return new Error ("File must be an image")
  }
}

const uploadImage = (file) => {
    fileFilter(file)

    const imageFileName = `${Math.round(Math.random() * 10000000)}.${file.type}`
    const storageRef = projectStorage.ref(imageFileName)
    const collectionRef = projectFirestore.collection('Twitter-Clone-images');

    storageRef.put(file).on('state_changed', (snap) => {

    }, (err) => {
      throw new Error (err)
    }, async () => {
        url = await storageRef.getDownloadURL();
        const createdAt = timestamp();
        await collectionRef.add({ url, createdAt });

    })
    return url

} */
const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

var storage = new GridFsStorage({
  url: process.env.DB_AUTH,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-twitter-clone-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: "tweet-image",
      filename: `${Date.now()}-twitter-clone-${file.originalname}`
    };
  }
});

var uploadFile = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFile);
module.exports = uploadFilesMiddleware;
