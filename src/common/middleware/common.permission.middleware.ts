import express from 'express';
import { PermissionLevel } from './common.permissionlevel.enum';
import debug from 'debug';

const log: debug.IDebugger = debug('app:common-permission-middleware');

class CommonPermissionMiddleware {
    minimumPermissionLevelRequired(requiredPermissionLevel: PermissionLevel) {
        return (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            try {
                const userPermissionLevel = parseInt(
                    res.locals.jwt.permissionLevel
                );
                // console.log('userPermissionLevel: ', userPermissionLevel);
                // console.log(
                //     'requiredPermissionLevel: ',
                //     requiredPermissionLevel
                // );

                if (userPermissionLevel & requiredPermissionLevel) {
                    // console.log('permission level is appropriate');
                    next();
                } else {
                    // console.log('permission level is inappropriate');
                    res.status(403).send();
                }
            } catch (e) {
                log(e);
            }
        };
    }

    async onlySameUserOrAdminCanDoThisAction(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const userPermissionLevel = parseInt(res.locals.jwt.permissionLevel);
        if (
            req.params &&
            req.params.userId &&
            req.params.userId === res.locals.jwt.userId
        ) {
            return next();
        } else {
            if (userPermissionLevel & PermissionLevel.ADMIN_PERMISSION) {
                return next();
            } else {
                return res.status(403).send();
            }
        }
    }

    async onlySamePlayerOrAdminCanDoThisAction(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const userPermissionLevel = parseInt(res.locals.jwt.permissionLevel);

        if (
            req.params &&
            req.params.playerDid &&
            req.params.playerDid === res.locals.jwt.did
        ) {
            return next();
        } else {
            if (userPermissionLevel & PermissionLevel.ADMIN_PERMISSION) {
                return next();
            } else {
                return res.status(403).send();
            }
        }
    }

    async onlyDIDOrAdminCanDoThisAction(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const userPermissionLevel = parseInt(res.locals.jwt.permissionLevel);

        if (req.body && req.body.did && req.body.did === res.locals.jwt.did) {
            return next();
        } else {
            if (userPermissionLevel & PermissionLevel.ADMIN_PERMISSION) {
                return next();
            } else {
                return res.status(403).send();
            }
        }
    }

    async onlyAdminCanDoThisAction(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const userPermissionLevel = parseInt(res.locals.jwt.permissionLevel);
        if (userPermissionLevel & PermissionLevel.ADMIN_PERMISSION) {
            return next();
        } else {
            return res.status(403).send();
        }
    }
}

export default new CommonPermissionMiddleware();
