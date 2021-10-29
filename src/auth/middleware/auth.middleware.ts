import express from 'express';
import usersService from '../../users/services/users.service';
import * as argon2 from 'argon2';

class AuthMiddleware {
    async validateBodyRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.body && req.body.did && req.body.password) {
            next();
        } else {
            res.status(400).send({
                errors: ['Missing required fields: did and password']
            });
        }
    }

    async verifyUserPassword(req: express.Request, res: express.Response, next: express.NextFunction) {
        const user: any = await usersService.getUserByDidWithPassword(req.body.did);
        if (user) {
            // const passwordHash = user.password;
            // if (await argon2.verify(passwordHash, req.body.password)) {
            req.body = {
                userId: user._id,
                did: user.did,
                // provider: 'did',
                password: req.body.password,
                permissionLevel: user.permissionLevel
            };
            return next();
            // } else {
            //     res.status(400).send({
            //         errors: ['Invalid did and/or password'],
            //     });
            // }
        } else {
            res.status(400).send({ errors: ['Invalid did and/or password'] });
        }
    }
}

export default new AuthMiddleware();
