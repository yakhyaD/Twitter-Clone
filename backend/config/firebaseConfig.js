const firebase = require('firebase')

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
}

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig)
const projectStorage = app.storage();
const projectFirestore = app.firestore();

exports.projectStorage = projectStorage
exports.projectFirestore = projectFirestore