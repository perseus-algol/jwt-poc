const jwt = require('jsonwebtoken');
require("dotenv").config();

const secret = process.env.ACCESS_TOKEN_SECRET || '';

function generateAccessToken(user) {
  return jwt.sign(user, secret, { expiresIn: '15m' });
}

const accessToken = generateAccessToken ({user: 'Joe'});

console.log(accessToken);

jwt.verify(accessToken, secret, (err, user) => {
  if (err) { 
    res.status(403).send("Token invalid")
  }
  else {
    console.log(user);
  }
})
