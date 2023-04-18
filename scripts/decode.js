const jwt = require('jsonwebtoken');
require("dotenv").config();

function decodeBase64(data) {
  let buff = Buffer.from(data, 'base64');
  return buff.toString('ascii');
}

function decodeToken(token) {
  const parts = token.split('.');
  return [
    decodeBase64(parts[0]),
    decodeBase64(parts[1]),
    parts[2]
  ];
}

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiSm9lIiwiaWF0IjoxNjgxNDkwMDMyLCJleHAiOjE2ODE0OTA5MzJ9.1D02AwYm9sCjNVLeYEzutbhjamjfWZaSf5pjN9qg0Ps";

console.log(jwt.decode(token));

console.log(decodeToken(token));