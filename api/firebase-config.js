const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "internet-arzan",
      // نکته: برای دسترسی کامل امن در سرور، از Service Account استفاده می‌شود
      // اما با databaseURL زیر نیز می‌توانید وصل شوید:
    }),
    databaseURL: "https://internet-arzan-default-rtdb.firebaseio.com" // آدرس دقیق دیتابیس خود را بگذارید
  });
}

const db = admin.database();
module.exports = db;
