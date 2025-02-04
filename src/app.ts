import { authenticateUser } from './lib/auth.js'
import { Request, Response } from 'express'
import { generateAccessToken, setSecret } from './lib/token'
import express, { Express } from 'express'
import { randomBytes } from 'crypto';
import { connect } from './lib/mongoose'
const port = process.env.PORT || 3000;
const app: Express = express();
const conection_string = process.env.CONNECTION_STRING || '';

//app.get("/", (req, res) => res.type('html').send(html));

async function initServer() {

  console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
  await connect(conection_string)

  const random_secret = randomBytes(64).toString('hex');
  let secret = process.env.TOKEN_SECRET as string || random_secret
  setSecret(secret)
  console.log("MongoDB connection successful")
}

app.get('/auth/:username/:password', [
  //param('username').notEmpty().isString().escape(),
  //param('password').notEmpty().isString(),
  authenticateUser
], (req: Request, res: Response) => {
  const token = { token: generateAccessToken(req.user, req.id) }
  res.json(token)
})


const server = app.listen(port, () => initServer());

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;