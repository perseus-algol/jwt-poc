import express from 'express';
import crypto from 'crypto';
import fs from 'fs';

const publicKeyStr = fs.readFileSync('keys-demo/public.pem');

const publicKey = crypto.createPublicKey(publicKeyStr)

const jwk = publicKey.export({ format: 'jwk' });

const app = express();

app.get('/.well-known/jwks.json', (req, res) => {
  const key = Object.assign({
    use: "sig",
    alg: "RS256",
    kid: "mykey",
  }, jwk);
  res.json({
    keys: [
      key
    ]
  });
});

app.listen(3000, () => {
  console.log('JWKS server listening on port 3000');
});
