const secrets = require("../secrets");
const jwt = require("jsonwebtoken");

module.exports = {
  errorMsg,
  restricted,
  verifyToken
}

function errorMsg(res, code, msg) {
  res.status(code).json({error: msg});
}

function restricted(req, res, next) {
  const token = req.headers.authorization;  
  jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
    if (err) {
      res.status(400).json({error: "Invalid token"})
    } else {
      req.user = {id: decodedToken.subject, username: decodedToken.username};
      next();
    }
  })
}

function verifyToken(req,res,next) {
  const token = req.headers.authorization;  
  jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
    if (err) {
      res.status(400).json({error: "Invalid token"})
    } else {
      req.decoded = decodedToken;
      next();
    }
  })
}