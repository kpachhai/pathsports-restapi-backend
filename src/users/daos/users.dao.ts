import mongooseService from '../../common/services/mongoose.service';
import shortid from 'shortid';
import debug from 'debug';
import { CreateUserDto } from '../dto/create.user.dto';
import { PatchUserDto } from '../dto/patch.user.dto';
import { PutUserDto } from '../dto/put.user.dto';

const log: debug.IDebugger = debug('app:users-dao');

class UsersDao {
    Schema = mongooseService.getMongoose().Schema;

    userSchema = new this.Schema({
        _id: String,
        did: String,
        password: { type: String, select: false },
        firstName: String,
        lastName: String,
        permissionLevel: Number
    });

    User = mongooseService.getMongoose().model('Users', this.userSchema);

    constructor() {
        log('Created new instance of UsersDao');
    }

    async addUser(userFields: CreateUserDto) {
        const userId = shortid.generate();
        const user = new this.User({
            _id: userId,
            permissionLevel: 1,
            ...userFields
        });
        await user.save();
        return userId;
    }

    async getUserByDid(did: string) {
        return this.User.findOne({ did }).exec();
    }

    async getUserByDidWithPassword(did: string) {
        return this.User.findOne({ did }).select('_id did permissionLevel +password').exec();
    }

    async removeUserById(userId: string) {
        return this.User.deleteOne({ _id: userId }).exec();
    }

    async getUserById(userId: string) {
        return this.User.findOne({ _id: userId }).populate('User').exec();
    }

    async getUsers(limit = 25, page = 0) {
        return this.User.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async updateUserById(userId: string, userFields: PatchUserDto | PutUserDto) {
        const existingUser = await this.User.findOneAndUpdate({ _id: userId }, { $set: userFields }, { new: true }).exec();

        return existingUser;
    }
}

export default new UsersDao();
