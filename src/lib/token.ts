import { sign, verify } from 'jsonwebtoken'
import { Response, NextFunction } from 'express'
import { Request } from 'express'
import { getUser } from './mongoose'

let secret = ""

function generateAccessToken(username: String, id: String) {
    return sign({ username: username, id: id }, secret, { expiresIn: '24h' })
}

function setSecret(new_secret: string) {
    secret = new_secret
}

async function authenticateToken(req: Request, res: Response, next: NextFunction) {
    let token
    const header = req.headers['authorization']
    console.log(req.headers)
    console.log('hello')
    if (header && typeof header === 'string') {
        if (header.startsWith('Bearer ')) {
            token = header.split(' ')[1]
        } else {
            console.log('wring header format')
            res.sendStatus(401)
            return;
        }

    } else {
        console.log('wrong header type')
        console.log(header)
        console.log(typeof header)
        res.sendStatus(401)
        return;
    }

    if (token == null) {
        console.log('null token')
        res.sendStatus(401)
        return;
    }

    verify(token, secret, async (err: any, user: any) => {
        if (err) {
            res.status(403).send()
            return;
        }

        // Check if user is in the database
        const db_user = await getUser(user.username)
        if (!db_user) {
            return res.status(403).send()
        }

        req.user = user.username
        req.id = user.id

        next()
    })
}



export { generateAccessToken, authenticateToken, setSecret }
