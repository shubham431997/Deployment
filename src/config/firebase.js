import admin from "firebase-admin";
const serviceAccount = require("./sarafoods-4d82c-firebase-adminsdk-fbsvc-d7b5e216a3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
