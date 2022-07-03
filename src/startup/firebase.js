var admin = require("firebase-admin");
const { getMessaging } = require("firebase-admin/messaging");

var serviceAccount = require("service-account-key.json");

var firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const subscribeToTopic = (registrationToken, topic) => {
  getMessaging(firebaseApp)
    .subscribeToTopic(registrationToken, topic)
    .then((response) => {
      console.log("success: ", response);
      return { response };
    })
    .catch((error) => {
      console.log("error: ", error);
      return { error };
    });
};

const unsubscribeFromTopic = (registrationToken, topic) => {
  getMessaging(firebaseApp)
    .unsubscribeFromTopic(registrationToken, topic)
    .then((response) => {
      console.log("success: ", response);
      return { response };
    })
    .catch((error) => {
      console.log("error: ", error);
      return { error };
    });
};

module.exports = { firebaseApp, admin, subscribeToTopic, unsubscribeFromTopic };
