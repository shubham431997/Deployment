import admin from "firebase-admin";
const serviceAccount = await import("./sarafoods-4d82c-firebase-adminsdk-fbsvc-d7b5e216a3.json", {
  assert: { type: "json" },
});


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
