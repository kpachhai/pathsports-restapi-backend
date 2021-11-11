import PlayersDao from '../daos/players.dao';
import { CRUDwithDid } from '../../common/interfaces/crud.interface';
import { CreatePlayerDto } from '../dto/create.player.dto';
import { PutPlayerDto } from '../dto/put.player.dto';
import { PatchPlayerDto } from '../dto/patch.player.dto';

class PlayersService implements CRUDwithDid {
    async create(resource: CreatePlayerDto) {
        return PlayersDao.addPlayer(resource);
    }

    async deleteByDid(did: string) {
        return PlayersDao.removePlayerByDid(did);
    }

    async list(limit: number, page: number) {
        return PlayersDao.getPlayers(limit, page);
    }

    async patchByDid(did: string, resource: PatchPlayerDto): Promise<any> {
        return PlayersDao.updatePlayerByDid(did, resource);
    }

    async patchStatsByDid(did: string, resource: PatchPlayerDto): Promise<any> {
        return PlayersDao.addPlayerStatsByDid(did, resource);
    }

    async putByDid(did: string, resource: PutPlayerDto): Promise<any> {
        return PlayersDao.updatePlayerByDid(did, resource);
    }

    // async readById(id: string) {
    //     return PlayersDao.getPlayerById(id);
    // }

    async readByDid(did: string) {
        return PlayersDao.getPlayerByDid(did);
    }

    async updateByDid(did: string, resource: CreatePlayerDto): Promise<any> {
        return PlayersDao.updatePlayerByDid(did, resource);
    }

    async getPlayerByDid(did: string) {
        return PlayersDao.getPlayerByDid(did);
    }

    // async getPlayerByEmail(email: string) {
    //     return PlayersDao.getPlayerByEmail(email);
    // }

    // async getPlayerByEmailWithPassword(email: string) {
    //     return PlayersDao.getPlayerByEmailWithPassword(email);
    // }
}

export default new PlayersService();
