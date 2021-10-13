import express from 'express';
import playerService from '../services/players.service';

class PlayersMiddleware {
    // async validateRequiredPlayerBodyFields(
    //     req: express.Request,
    //     res: express.Response,
    //     next: express.NextFunction
    // ) {
    //     if (req.body && req.body.email && req.body.password) {
    //         next();
    //     } else {
    //         res.status(400).send({
    //             errors: ['Missing required fields: email and password'],
    //         });
    //     }
    // }

    async validateRequiredPlayerBodyFields(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && req.body.did) {
            next();
        } else {
            res.status(400).send({
                errors: ['Missing required fields: did'],
            });
        }
    }

    async validateSameDidDoesntExist(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const player = await playerService.getPlayerByDid(req.body.did);
        if (player) {
            res.status(400).send({ errors: ['Player DID already exists'] });
        } else {
            next();
        }
    }

    // async validateSameEmailBelongToSameUser(
    //     req: express.Request,
    //     res: express.Response,
    //     next: express.NextFunction
    // ) {
    //     const user = await userService.getUserByEmail(req.body.email);
    //     if (user && user.id === req.params.userId) {
    //         res.locals.user = user;
    //         next();
    //     } else {
    //         res.status(400).send({ errors: ['Invalid email'] });
    //     }
    // }

    // async userCantChangePermission(
    //     req: express.Request,
    //     res: express.Response,
    //     next: express.NextFunction
    // ) {
    //     if (res.locals.user.permissionLevel !== req.body.permissionLevel) {
    //         res.status(400).send({
    //             errors: ['User cannot change permission level'],
    //         });
    //     } else {
    //         next();
    //     }
    // }

    // validatePatchEmail = async (
    //     req: express.Request,
    //     res: express.Response,
    //     next: express.NextFunction
    // ) => {
    //     if (req.body.email) {
    //         this.validateSameEmailBelongToSameUser(req, res, next);
    //     } else {
    //         next();
    //     }
    // };

    async validatePlayerExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const player = await playerService.readByDid(req.params.playerDid);
        if (player) {
            next();
        } else {
            res.status(404).send({
                errors: [`Player ${req.params.playerDid} not found`],
            });
        }
    }

    async extractPlayerDid(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.did = req.params.playerDid;
        next();
    }

    // async validatePlayerExistsById(
    //     req: express.Request,
    //     res: express.Response,
    //     next: express.NextFunction
    // ) {
    //     const player = await playerService.readById(req.params.playerId);
    //     if (player) {
    //         next();
    //     } else {
    //         res.status(404).send({
    //             errors: [`Player ${req.params.playerId} not found`],
    //         });
    //     }
    // }

    // async extractPlayerId(
    //     req: express.Request,
    //     res: express.Response,
    //     next: express.NextFunction
    // ) {
    //     req.body.id = req.params.playerId;
    //     next();
    // }
}

export default new PlayersMiddleware();
