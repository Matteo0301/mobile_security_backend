import { authenticateUser } from './lib/auth.js'
import { NextFunction, Request, Response } from 'express'
import { authenticateToken, generateAccessToken, setSecret } from './lib/token'
import express, { Express } from 'express'
import { randomBytes } from 'crypto';
import { addTask, addUser, checkTask, connect, deleteTask, getTasks, getUser, updateTask } from './lib/mongoose'
import { body, param, validationResult } from 'express-validator';
import bodyParser from 'body-parser';
const port = process.env.PORT || 3000;
const app: Express = express();
const conection_string = process.env.CONNECTION_STRING || '';

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

//app.get("/", (req, res) => res.type('html').send(html));

async function checkValidationErrors(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    res.status(400).send()
  }
  else {
    next()
  }
}
async function initServer() {

  console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
  await connect(conection_string)

  const random_secret = randomBytes(64).toString('hex');
  let secret = process.env.TOKEN_SECRET as string || random_secret
  setSecret(secret)
  console.log("MongoDB connection successful")
}

app.get('/auth/:username/:password', [
  param('username').notEmpty().isString().isAlphanumeric(),
  param('password').notEmpty().isString(),
  checkValidationErrors,
  authenticateUser,
], (req: Request, res: Response) => {
  const token = { token: generateAccessToken(req.user, req.id) }
  res.json(token)
})

app.post('/register', [
  body('username').notEmpty().isString().isAlphanumeric(),
  body('password').notEmpty().isString(),
  checkValidationErrors,
], async (req: Request, res: Response) => {
  const user = await getUser(req.body.username)
  console.log(user)
  if (user != null && user != undefined) {
    res.status(400).send("User already exists")
  }
  if (await addUser(req.body.username, req.body.password)) {
    const newUser = await getUser(req.body.username)
    if (newUser == null) {
      res.status(500).send()
    }
    const token = { token: generateAccessToken(newUser!.username!, newUser!._id.toString()) }
    res.json(token)
  } else {
    res.status(500).send()
  }

})

app.get('/tasks', [
  authenticateToken,
], async (req: Request, res: Response) => {
  const tasks = await getTasks(req.id)
  res.json({ tasks: tasks })
})

app.post('/tasks', [
  body('title').notEmpty().isString(),
  body('description').notEmpty().isString(),
  //checkValidationErrors,
  authenticateToken,
], async (req: Request, res: Response) => {
  addTask(req.body.title, req.body.description, req.id)
  res.sendStatus(200)
})

app.delete('/task/:id', [
  param('id').notEmpty().isString(),
  //checkValidationErrors,
  authenticateToken,
], async (req: Request, res: Response) => {
  if (!(await checkTask(req.params.id))) {
    res.sendStatus(404)
  } else {
    await deleteTask(req.params.id)
    res.sendStatus(200)
  }
})

app.patch('/task/:id', [
  param('id').notEmpty().isString(),
  body('completed').isBoolean(),
  //checkValidationErrors,
  authenticateToken,
], async (req: Request, res: Response) => {
  const check = !(await checkTask(req.params.id))
  console.log(check)
  if (check) {
    console.log('not found')
    res.sendStatus(404)
  } else {
    await updateTask(req.params.id, req.body.completed)
    console.log(await getTasks(req.id))
    res.sendStatus(200)
  }
})




const server = app.listen(port, () => initServer());

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;