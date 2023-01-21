const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRound = 10;
const secretKey = "somewhatismysecretkey";

const hashedPassword = async (password) => {
  let salt = await bcrypt.genSalt(saltRound);
  // console.log(salt);
  return await bcrypt.hash(password, salt);
};

const hashCompare = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const createToken = async ({ email, role, firstName, lastName }) => {
  let token = await jwt.sign({ email, role, firstName, lastName }, secretKey, {
    expiresIn: "5m",
  });
  return token;
};
const createTokenForPass = async (email) => {
  let token = await jwt.sign({ email }, secretKey, {
    expiresIn: "1h",
  });
  return token;
};
const decodeToken = async (token) => {
  return await jwt.decode(token);
};

const validate = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    let token = await req.headers.authorization.split(" ")[1];
    let decodeMyToken = await decodeToken(token);
    req.mydecodeToken = decodeMyToken;
    if (Math.round(Date.now() / 1000) < decodeMyToken.exp) {
      next();
    } else {
      res.send({ statusCode: 400, message: "token is expired" });
    }
  } else {
    res.send({ statusCode: 400, message: "Token is missing" });
  }
};
const roleOwners = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    let token = await req.headers.authorization.split(" ")[1];
    let decodeMyToken = await decodeToken(token);
    if (decodeMyToken.role === "admin") {
      next();
    } else {
      res.send({ statusCode: 400, message: "only admin can access" });
    }
  } else {
    res.send({ statusCode: 400, message: "Token is missing" });
  }
};
module.exports = {
  hashedPassword,
  hashCompare,
  createToken,
  createTokenForPass,
  decodeToken,
  validate,
  roleOwners,
};
