import admin from "firebase-admin";
import serviceAccount from "/etc/secrets/sarafoods-firebase-adminsdk-fbsvc-8af93f3c7c.json" assert { type: "json" };


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
