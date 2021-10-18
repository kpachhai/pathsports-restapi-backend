import express from 'express';
import userService from '../services/users.service';

class UsersMiddleware {
    async validateRequiredUserBodyFields(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && req.body.did && req.body.password) {
            next();
        } else {
            res.status(400).send({
                errors: ['Missing required fields: did and password'],
            });
        }
    }

    async validateSameDidDoesntExist(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await userService.getUserByDid(req.body.did);
        if (user) {
            res.status(400).send({ errors: ['User did already exists'] });
        } else {
            next();
        }
    }

    async validateSameDidBelongToSameUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await userService.getUserByDid(req.body.did);
        if (user && user.id === req.params.userId) {
            res.locals.user = user;
            // console.log('validateSameDidBelongToSameUser Success');
            next();
        } else {
            res.status(400).send({ errors: ['Invalid did'] });
        }
    }

    async userCantChangePermission(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (res.locals.user.permissionLevel !== req.body.permissionLevel) {
            res.status(400).send({
                errors: ['User cannot change permission level'],
            });
        } else {
            next();
        }
    }

    validatePatchDid = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (req.body.did) {
            this.validateSameDidBelongToSameUser(req, res, next);
        } else {
            next();
        }
    };

    async validateUserExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await userService.readById(req.params.userId);
        if (user) {
            next();
        } else {
            res.status(404).send({
                errors: [`User ${req.params.userId} not found`],
            });
        }
    }

    async extractUserId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.userId;
        next();
    }
}

export default new UsersMiddleware();
