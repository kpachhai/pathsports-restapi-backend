import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import * as http from 'http';
import * as bodyparser from 'body-parser';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import { CommonRoutesConfig } from './common/common.routes.config';
import { PlayersRoutes } from './players/players.routes.config';
import { UsersRoutes } from './users/users.routes.config';
import { AuthRoutes } from './auth/auth.routes.config';
import debug from 'debug';
import helmet from 'helmet';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;
const routes: CommonRoutesConfig[] = [];
const debugLog: debug.IDebugger = debug('app');

app.use(express.json({ limit: '32mb' }));
app.use(
    express.urlencoded({
        limit: '32mb',
        extended: true,
        parameterLimit: 1000000
    })
);
app.use(cors({ origin: true }));
app.use(helmet());

const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.json(), winston.format.prettyPrint(), winston.format.colorize({ all: true }))
};

if (!process.env.DEBUG) {
    loggerOptions.meta = false; // when not debugging, make terse
    if (typeof global.it === 'function') {
        loggerOptions.level = 'http'; // for non-debug test runs, squelch entirely
    }
}

app.use(expressWinston.logger(loggerOptions));

routes.push(new PlayersRoutes(app));
routes.push(new UsersRoutes(app));
routes.push(new AuthRoutes(app));

app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send({
        message: `Pathsports server running at http://localhost:${port}`
    });
});
export default server.listen(port, () => {
    debugLog(`Server running at http://localhost:${port}`);
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });
});
