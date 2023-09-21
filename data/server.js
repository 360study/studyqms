const fs = require("fs");
const bodyParser = require("body-parser");
const jsonServer = require("json-server");
const server = jsonServer.create();
const jwt = require("jsonwebtoken");
// 导入 cors 模块
const cors = require("cors");

// 使用 cors 中间件
server.use(cors());
//const path = require("path");
//const router = jsonServer.router(path.join(__dirname, "./db.json"));
const qms_dataRouter = jsonServer.router("./db/qms.json");
const ohms_dataRouter = jsonServer.router("./db/ohms.json");
const fuwu_dataRouter = jsonServer.router("./db/fuwu.json");
const userRouter = jsonServer.router("./db/user.json");
const configRouter = jsonServer.router("./config.json");
let userdb = JSON.parse(fs.readFileSync("./db/user.json", "utf-8"));
const middlewares = jsonServer.defaults();

var passport = require("passport"); // <1>
var Strategy = require("passport-http").BasicStrategy;
var db = require("./db/index");
// 引入 body-parser
// 使用 body-parser.json() 解析 json 格式请求体
server.use(bodyParser.json());
// Configure the Basic strategy for use by Passport.    // <2>
// passport.use(
//   new Strategy(function (username, password, cb) {
//     db.users.findByUsername(username, function (err, user) {
//       if (err) {
//         return cb(err);
//       }
//       if (!user) {
//         return cb(null, false);
//       }
//       if (user.password != password) {
//         return cb(null, false);
//       }
//       return cb(null, user);
//     });
//   })
// );
const SECRET_KEY = "123123123";
const expiresIn = "1m";

// Create a token from a payload
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Verify the token
function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) =>
    decode !== undefined ? decode : err
  );
}

// Check if the user exists in database
async function isAuthenticated({ username, password }) {
  !userdb
    ? (userdb = await JSON.parse(fs.readFileSync("./user.json", "utf-8")))
    : "";
  return (
    userdb.users.findIndex(
      (user) => user.username === username && user.password === password
    ) !== -1
  );
}

// http -a jack:secret localhost:3000/email     // <3>
server.get(
  "/email",
  passport.authenticate("basic", { session: false }),
  function (req, res) {
    res.json({ username: req.user.username, email: req.user.emails[0].value });
  }
);
// http localhost:3000/wines
server.use("/qms", qms_dataRouter); ///可以加载多个数据源，只要路径不冲突即可
server.use("/ohms", ohms_dataRouter); ///可以加载多个数据源，只要路径不冲突即可
server.use("/fuwu", fuwu_dataRouter); ///可以加载多个数据源，只要路径不冲突即可
//server.use(middlewares);
server.post("/login", (req, res) => {
  console.log("req");
  console.log("req.body");
  console.log(req);
  console.log(req.body);
  const { username, password } = req.body;
  if (isAuthenticated({ username, password }) === false) {
    const status = 401;
    const message = "Incorrect email or password";
    res.status(status).json({ status, message });
    return;
  }
  const access_token = createToken({ username, password });
  res.status(200).json({ access_token });
  // console.log({ access_token });
  // res.redirect("/product/products");
});
server.use(/^(?!\/login).*$/, (req, res, next) => {
  if (
    req.headers.authorization === undefined ||
    req.headers.authorization.split(" ")[0] !== "Bearer"
  ) {
    const status = 401;
    const message = "Bad authorization header";
    res.status(status).json({ status, message });
    return;
  }
  try {
    verifyToken(req.headers.authorization.split(" ")[1]);
    next();
  } catch (err) {
    const status = 401;
    const message = "Error: access_token is not valid";
    res.status(status).json({ status, message });
  }
});

server.use("/users", userRouter);
// server.use("/", configRouter);

server.listen(3000, () => {
  console.log("JSON Server is running on 3000");
});
