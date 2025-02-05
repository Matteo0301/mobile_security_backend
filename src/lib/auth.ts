import { Request, Response, NextFunction } from 'express'
import { db, getUser } from './mongoose'
import { compareSync } from 'bcrypt'

async function authenticateUser(req: Request, res: Response, next: NextFunction) {
    const request_user = req.params.username
    const request_password = req.params.password

    let user = await getUser(request_user)
    if (user && user.password !== undefined && user.password !== null) {
        if (compareSync(request_password, user.password)) {
            req.user = request_user
            req.id = user._id.toString();
            next()
        } else {
            res.sendStatus(401)
        }
    } else {
        res.sendStatus(401)
    }
}

async function checkTokenMatchesUser(req: Request, res: Response, next: NextFunction) {
    if (req.user !== req.params.username) {
        res.sendStatus(403)
    }
    else {
        next()
    }
}

export { authenticateUser, checkTokenMatchesUser, /* checkValidationErrors */ }