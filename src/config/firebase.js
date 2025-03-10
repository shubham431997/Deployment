import admin from "firebase-admin";
import serviceAccount from "./sarafoods-4d82c-firebase-adminsdk-fbsvc-d7b5e216a3.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
