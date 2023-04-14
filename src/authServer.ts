import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

interface IUserId {
  user: string;
}

interface IUser extends IUserId {
  password: string;
}

function generateAccessToken(user: IUserId) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET || '', { expiresIn: '15m' });
}

// refreshTokens
const refreshTokens: string[] = []

function generateRefreshToken(user: IUserId) {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET || '', { expiresIn: '20m' });
  refreshTokens.push(refreshToken);
  return refreshToken;
}

const users: IUser[] = [];

const port = process.env.TOKEN_SERVER_PORT  //get the port number from .env file

const app = express()

app.use(express.json()) //This middleware will allow us to pull req.body.<params>

// REGISTER A USER
app.post ("/createUser", async (req,res) => {
  const user = req.body.name
  console.log(req.body);
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  users.push ({user: user, password: hashedPassword})
  res.status(201).send(users)
  console.log(users)
});

//AUTHENTICATE LOGIN AND RETURN JWT TOKEN
app.post("/login", async (req, res) => {
  const user = users.find(c => c.user == req.body.name)
  
  //check to see if the user exists in the list of registered users
  if (user === undefined) 
  {
    res.status(404).send ("User does not exist!")
  }
  else {
    //if user does not exist, send a 400 response
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = generateAccessToken ({user: req.body.name})
      
      // log data to console
      console.log(accessToken);
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || '', (err, user) => {
        console.log(user);
      })

      const refreshToken = generateRefreshToken ({user: req.body.name})
      res.json ({accessToken: accessToken, refreshToken: refreshToken})
    } 
    else {
      res.status(401).send("Password Incorrect!")
    }
  }
})

//REFRESH TOKEN API
app.post("/refreshToken", (req,res) => {
  const token: string = req.body.token;
  const idx = refreshTokens.findIndex(i => i === token)
  
  if (idx === -1) {
    res.status(400).send("Refresh Token Invalid");
  }

  refreshTokens.splice(idx, 1); //remove the old refreshToken from the refreshTokens list
  
  //generate new accessToken and refreshTokens
  const accessToken = generateAccessToken ({user: req.body.name})
  const refreshToken = generateRefreshToken ({user: req.body.name})
  
  res.json ({accessToken: accessToken, refreshToken: refreshToken})
})

app.delete("/logout", (req,res)=>{
  const token: string = req.body.token;
  const idx = refreshTokens.findIndex(i => i === token)
  
  if (idx === -1) {
    res.status(400).send("Refresh Token Invalid");
  }
  
  refreshTokens.splice(idx, 1); //remove the old refreshToken from the refreshTokens list
  res.status(204).send("Logged out!")
})

app.listen(port, () => { 
  console.log(`Authorization Server running on ${port}...`)
});
