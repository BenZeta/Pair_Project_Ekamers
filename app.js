if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const router = require("./routers");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const redis = require("redis");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const client = redis.createClient({
  host: "localhost", // Replace with your Redis server info
  port: 6379, // Default Redis port
});

app.use(
  session({
    store: new RedisStore({ client }),
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
    },
  })
);

app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
