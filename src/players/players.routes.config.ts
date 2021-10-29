import { CommonRoutesConfig } from '../common/common.routes.config';
import PlayersController from './controllers/players.controller';
import PlayersMiddleware from './middleware/players.middleware';
import jwtMiddleware from '../auth/middleware/jwt.middleware';
import permissionMiddleware from '../common/middleware/common.permission.middleware';
import { PermissionLevel } from '../common/middleware/common.permissionlevel.enum';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import { body } from 'express-validator';

import express from 'express';

export class PlayersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'PlayersRoutes');
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/players`)
            .get(jwtMiddleware.validJWTNeeded, permissionMiddleware.onlyAdminCanDoThisAction, PlayersController.listPlayers)
            .post(
                jwtMiddleware.validJWTNeeded,
                PlayersMiddleware.validateRequiredPlayerBodyFields,
                PlayersMiddleware.validateSameDidDoesntExist,
                permissionMiddleware.onlyDIDOrAdminCanDoThisAction,
                PlayersController.createPlayer
            );

        this.app.param(`playerDid`, PlayersMiddleware.extractPlayerDid);
        this.app
            .route(`/players/:playerDid`)
            .all(PlayersMiddleware.validatePlayerExists, jwtMiddleware.validJWTNeeded, permissionMiddleware.onlySamePlayerOrAdminCanDoThisAction)
            .get(PlayersController.getPlayerByDid)
            .delete(PlayersController.removePlayer);

        this.app.put(`/players/:playerDid`, [
            jwtMiddleware.validJWTNeeded,
            // body('email').isEmail(),
            // body('password')
            //     .isLength({ min: 5 })
            //     .withMessage('Must include password (5+ characters)'),
            body('firstName').isString(),
            body('lastName').isString(),
            // body('permissionLevel').isInt(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            // PlayersMiddleware.validateSameEmailBelongToSameUser,
            // PlayersMiddleware.playerCantChangePermission,
            permissionMiddleware.onlySamePlayerOrAdminCanDoThisAction,
            permissionMiddleware.minimumPermissionLevelRequired(PermissionLevel.PAID_PERMISSION),
            PlayersController.put
        ]);

        this.app.patch(`/players/:playerDid/stats`, [
            jwtMiddleware.validJWTNeeded,
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            permissionMiddleware.onlySamePlayerOrAdminCanDoThisAction,
            PlayersController.patchStats
        ]);

        this.app.patch(`/players/:playerDid`, [
            jwtMiddleware.validJWTNeeded,
            // body('email').isEmail().optional(),
            // body('password')
            //     .isLength({ min: 5 })
            //     .withMessage('Password must be 5+ characters')
            //     .optional(),
            body('firstName').isString().optional(),
            body('lastName').isString().optional(),
            // body('permissionLevel').isInt().optional(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            // PlayersMiddleware.validatePatchEmail,
            permissionMiddleware.onlySamePlayerOrAdminCanDoThisAction,
            permissionMiddleware.minimumPermissionLevelRequired(PermissionLevel.PAID_PERMISSION),
            PlayersController.patch
        ]);

        return this.app;
    }
}
