import express from 'express';
import { validationResult } from 'express-validator';

class BodyValidationMiddleware {
    verifyBodyFieldsErrors(req: express.Request, res: express.Response, next: express.NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // console.log('verifyBodyFields Errors');
            return res.status(400).send({ errors: errors.array() });
        }
        // console.log('verifyBodyFields Success');
        next();
    }
}

export default new BodyValidationMiddleware();
