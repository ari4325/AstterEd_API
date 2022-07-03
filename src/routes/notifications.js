require("dotenv").config();
const { Router } = require("express");
const router = Router();
const { getMessaging } = require("firebase-admin/messaging");
const { UserToken } = require("../models");
const {
  subscribeToTopic,
  unsubscribeFromTopic,
} = require("../startup/firebase");

router.post("/", (req, res) => {
  try {
    const {
      notificationTitle,
      notificationBody,
      image,
      image_url,
      clickAction,
      androidClickAction,
      iosClickAction,
      icon,
      data,
      topicName,
    } = req.body;

    const message = {};

    if (data !== undefined) message.data = data;
    if (notificationTitle) {
      message.notification.title = notificationTitle;
      message.notification.body = notificationBody;
      message.android = {
        notification: {},
      };
      message.apns = {
        payload: {
          aps: {},
        },
      };

      if (clickAction === true) {
        message.android.notification.clickAction = androidClickAction;
        message.apns.payload.aps.category = iosClickAction;
      }

      if (image) {
        message.android.notification.imageUrl = image_url;
        message.apns.payload.aps["mutable-content"] = 1;
        message.apns["fcm_options"] = { image: image_url };
      }

      if (icon) message.android.notification.icon = icon;
    }

    if (topicName) {
      message.topic = topicName;

      getMessaging()
        .send(message)
        .then((response) => {
          console.log("Successfully sent message:", response);
          res.status(200).json({
            message: "Successfully sent message",
            data: response,
          });
        })
        .catch((error) => {
          console.log("Error sending message:", error);
          res.status(400).json({
            message: "Message not sent",
          });
        });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      errorMessage: "Internal Server Error",
      errorType: "Internal Server Error",
    });
  }
});

router.post("/subscribe", (req, res) => {
  try {
    const { registrationToken, topic } = req.body;
    const { response, error } = subscribeToTopic(registrationToken, topic);
    if (error) {
      res.status(400).json({
        success: false,
        error: error,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "subscribed successfully",
        data: response,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      errorMessage: "Internal Server Error",
      errorType: "Internal Server Error",
    });
  }
});

router.post("/unsubscribe", (req, res) => {
  try {
    const { registrationToken, topic } = req.body;
    const { response, error } = unsubscribeFromTopic(registrationToken, topic);
    if (error) {
      res.status(400).json({
        success: false,
        error: error,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "unsubscribed successfully",
        data: response,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      errorMessage: "Internal Server Error",
      errorType: "Internal Server Error",
    });
  }
});

router.post("/renewToken", async (req, res) => {
  try {
    const userId = req.user.id;
    const { renewedRegistrationToken } = req.body;

    let userToken = UserToken.findOne({ userId });
    let previousToken = userToken.registrationToken;
    userToken.registrationToken = renewedRegistrationToken;

    let subscribedTopics = userToken.subscribedTopics;

    subscribedTopics.forEach((topic) => {
      subscribeToTopic(renewedRegistrationToken, topic);
      unsubscribeFromTopic(previousToken, topic);
    });
    return res.status(200).json({
      success: true,
      message: "renewed the token",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      errorMessage: "Internal Server Error",
      errorType: "Internal Server Error",
    });
  }
});

module.exports = router;
