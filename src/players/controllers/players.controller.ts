import express from 'express';
import playersService from '../services/players.service';
import argon2 from 'argon2';
import debug from 'debug';
// import { PatchPlayerDto } from '../dto/patch.player.dto';

const log: debug.IDebugger = debug('app:players-controller');

class PlayersController {
    async listPlayers(req: express.Request, res: express.Response) {
        const players = await playersService.list(100, 0);
        res.status(200).send(players);
    }

    async getPlayerByDid(req: express.Request, res: express.Response) {
        const player = await playersService.readByDid(req.params.playerDid);
        res.status(200).send(player);
    }

    // async getPlayerById(req: express.Request, res: express.Response) {
    //     const player = await playersService.readById(req.params.playerId);
    //     res.status(200).send(player);
    // }

    async createPlayer(req: express.Request, res: express.Response) {
        // req.body.password = await argon2.hash(req.body.password);
        const playerId = await playersService.create(req.body);
        res.status(201).send({ id: playerId });
    }

    async patch(req: express.Request, res: express.Response) {
        // if (req.body.password) {
        //     req.body.password = await argon2.hash(req.body.password);
        // }
        log(await playersService.patchByDid(req.params.playerDid, req.body));
        res.status(204).send();
    }

    async patchStats(req: express.Request, res: express.Response) {
        log(
            await playersService.patchStatsByDid(req.params.playerDid, req.body)
        );
        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        // req.body.password = await argon2.hash(req.body.password);
        log(await playersService.putByDid(req.params.playerDid, req.body));
        res.status(204).send();
    }

    async removePlayer(req: express.Request, res: express.Response) {
        log(await playersService.deleteByDid(req.params.playerDid));
        res.status(204).send();
    }

    // async updatePermissionLevel(req: express.Request, res: express.Response) {
    //     const patchPlayerDto: PatchPlayerDto = {
    //         //permissionLevel: parseInt(req.params.permissionLevel),
    //     };
    //     log(
    //         await playersService.patchById(req.params.playerId, patchPlayerDto)
    //     );
    //     res.status(204).send();
    // }
}

export default new PlayersController();
