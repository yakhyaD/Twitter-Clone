const { projectStorage } = require("./firebaseConfig");

const imageTypes = ["image/png", "image/jpeg", "image/jpg"];

const uploadImage = (req, res) => {
  const storageRef = projectStorage.ref();

  const { originalname, mimetype, buffer } = req.files[0];

  if (!imageTypes.includes(mimetype)) {
    return res.status(400).send("Invalid image type");
  }

  try {
    // Upload file and metadata to the object 'images/mountains.jpg'
    const metadata = {
      contentType: mimetype,
    };
    const uploadTask = storageRef
      .child(`twitter-clone/${req.user.username}/` + originalname)
      .put(buffer, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed", // or 'state_changed'
      (snapshot) => {},
      (error) => {
        return res.status(500).json({ error: error });
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          return res.status(200).json({ url: downloadURL });
        });
      }
    );
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

module.exports = { uploadImage };
