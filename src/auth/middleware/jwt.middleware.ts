import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Jwt } from '../../common/types/jwt';
import usersService from '../../users/services/users.service';

// @ts-expect-error
const jwtSecret: string = process.env.JWT_SECRET;

class JwtMiddleware {
    verifyRefreshBodyField(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && req.body.refreshToken) {
            // console.log('verifyRefreshBodyField success');
            return next();
        } else {
            // console.log('verifyRefreshBodyField error');
            return res
                .status(400)
                .send({ errors: ['Missing required field: refreshToken'] });
        }
    }

    async validRefreshNeeded(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        // console.log('validRefreshNeeded starts');
        const user: any = await usersService.getUserByDidWithPassword(
            res.locals.jwt.did
        );
        const salt = crypto.createSecretKey(
            Buffer.from(res.locals.jwt.refreshKey.data)
        );
        const hash = crypto
            .createHmac('sha512', salt)
            .update(res.locals.jwt.did + jwtSecret)
            .digest('base64');
        if (hash === req.body.refreshToken) {
            req.body = {
                userId: user._id,
                did: user.did,
                // provider: 'email', waqas
                permissionLevel: user.permissionLevel,
            };
            return next();
        } else {
            // console.log('validRefreshNeeded ends');
            return res.status(400).send({ errors: ['Invalid refresh token'] });
        }
    }

    validJWTNeeded(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.headers.authorization) {
            try {
                const authorization = req.headers.authorization.split(' ');
                if (authorization[0] !== 'Bearer') {
                    // console.log('validJWTNeeded error');
                    return res.status(401).send();
                } else {
                    res.locals.jwt = jwt.verify(
                        authorization[1],
                        jwtSecret
                    ) as Jwt;
                    // console.log('validJWTNeeded success', res.locals.jwt);
                    next();
                }
            } catch (err) {
                // console.log('validJWTNeeded caught error');
                return res.status(403).send();
            }
        } else {
            // console.log('validJWTNeeded auth header not found');
            return res.status(401).send();
        }
    }
}

export default new JwtMiddleware();
