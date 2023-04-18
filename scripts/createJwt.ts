import jwt from "jsonwebtoken";
import fs from 'fs';

const publicKeyStr = fs.readFileSync('keys-demo/private.pem');

interface IUserId {
  user: string;
}

function generateAccessToken(user: IUserId) {
  return jwt.sign(user, publicKeyStr, { algorithm: 'RS256', expiresIn: '15m', keyid: 'mykey' });
}

const user: IUserId = {
  user: 'bill',
}

const token = generateAccessToken(user);

console.log(token);