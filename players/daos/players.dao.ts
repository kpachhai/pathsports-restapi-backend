import mongooseService from '../../common/services/mongoose.service';
import shortid from 'shortid';
import debug from 'debug';
import { CreatePlayerDto, StatisticsDto } from '../dto/create.player.dto';
import { PatchPlayerDto } from '../dto/patch.player.dto';
import { PutPlayerDto } from '../dto/put.player.dto';

const log: debug.IDebugger = debug('app:players-dao');

class PlayersDao {
    Schema = mongooseService.getMongoose().Schema;

    birthSchema = new this.Schema({
        date: Date,
        place: String,
        country: String,
    });

    socialSchema = new this.Schema({
        instagram: String,
        facebook: String,
        snapchat: String,
        discord: String,
    });

    statisticsSchema = new this.Schema({
        team: {
            did: String,
            id: String,
            name: String,
            logo: String,
        },
        league: {
            did: String,
            id: String,
            name: String,
            country: String,
            logo: String,
            flag: String,
            season: Number,
        },
        games: {
            number: Number,
            position: String,
            captain: Boolean,
        },
        shots: {
            total: Number,
            on: Number,
        },
        goals: {
            total: Number,
            assists: Number,
            saves: Number,
        },
        fouls: {
            drawn: Number,
            committed: Number,
        },
        cards: {
            yellow: Number,
            yellowred: Number,
            red: Number,
        },
        penalty: {
            won: Number,
            commited: Number,
            scored: Number,
            missed: Number,
            saved: Number,
        },
    });

    playerSchema = new this.Schema({
        _id: String,
        did: String,
        // email: String,
        // password: { type: String, select: false },
        firstName: String,
        lastName: String,
        // permissionLevel: Number,
        name: String,
        birth: this.birthSchema,
        nationality: String,
        height: String,
        weight: String,
        injured: Boolean,
        photo: String,
        sport: String,
        team: String,
        social: this.socialSchema,
        statistics: [this.statisticsSchema],
    });

    Player = mongooseService.getMongoose().model('Players', this.playerSchema);

    constructor() {
        log('Created new instance of PlayersDao');
    }

    async addPlayer(playerFields: CreatePlayerDto) {
        const playerId = shortid.generate();
        const player = new this.Player({
            _id: playerId,
            // permissionLevel: 1,
            ...playerFields,
        });
        await player.save();
        return playerId;
        // return playerFields.did;
    }

    async removePlayerByDid(playerDid: string) {
        return this.Player.deleteOne({ did: playerDid }).exec();
    }

    async getPlayerByDid(playerDid: string) {
        return this.Player.findOne({ did: playerDid })
            .populate('Player')
            .exec();
    }

    async getPlayers(limit = 25, page = 0) {
        return this.Player.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async updatePlayerByDid(
        playerDid: string,
        playerFields: PatchPlayerDto | PutPlayerDto
    ) {
        // console.log('playerDid: ', playerDid);
        // console.log('playerFields: ', playerFields);

        const existingPlayer = await this.Player.findOneAndUpdate(
            { did: playerDid },
            { $set: playerFields },
            { new: true }
        ).exec();

        return existingPlayer;
    }

    async addPlayerStatsByDid(playerDid: string, statsFields: PatchPlayerDto) {
        const existingPlayer = await this.Player.findOneAndUpdate(
            { did: playerDid },
            { $addToSet: { statistics: statsFields } },
            { new: true }
        ).exec();

        return existingPlayer;
    }
}

export default new PlayersDao();
