const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");

app.listen(process.env.PORT || 3000, () => {
  console.log("RUN SERVER");
});

app.use(function (req, res, next) {
  var oneof = false;
  if (req.headers.origin) {
    res.header("Access-Control-Allow-Origin", "https://yeong30.github.io");
    oneof = true;
  }
  if (req.headers["access-control-request-method"]) {
    res.header(
      "Access-Control-Allow-Methods",
      req.headers["access-control-request-method"]
    );
    oneof = true;
  }
  if (req.headers["access-control-request-headers"]) {
    res.header(
      "Access-Control-Allow-Headers",
      req.headers["access-control-request-headers"]
    );
    oneof = true;
  }
  if (oneof) {
    res.header("Access-Control-Max-Age", 60 * 60 * 24 * 365);
  }
  next();
  // }
  // // intercept OPTIONS method
  // if (oneof && req.method == "OPTIONS") {
  //   res.sendStatus(200);
  // } else {
  //   next();
  // }
});

router.get("/awake", (req, res) => {
  res.send("HELLO");
});

// middleware , url이 고정됨, + body값 핸들링 미들웨어
app.use("/api", bodyParser.json(), router);
// + static 파일 서빙 미들웨어
app.use(express.static("./assets"));

// configure the app to use bodyParser()
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const todos = require("./routes/todo/todo");
app.use("/todos", bodyParser.json(), todos);

const http = require("http");
const cron = require("node-cron");
cron.schedule("*/20 23,0-14 * * *", () => {
  console.log("10 minutes awake");
  http.get("https://yeong-todos.herokuapp.com/awake");
});
