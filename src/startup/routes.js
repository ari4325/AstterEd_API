const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const { user, video } = require("../routes/");
const MongoDBStore = require("connect-mongodb-session")(session);

const SESSION_SECRET = process.env.SESSION_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

// create store for storing sessions
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

store.on("error", function (error) {
  console.log(error);
});

module.exports = (app) => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: store,
      cookie: {
        // httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },
    })
  );
  app.use("/api/user", user);
  app.use("/api/video", video);
};
