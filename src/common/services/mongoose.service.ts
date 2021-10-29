import mongoose from 'mongoose';
import debug from 'debug';

const log: debug.IDebugger = debug('app:mongoose-service');

const MONGO_USERNAME = process.env.MONGO_USERNAME || 'mongoadmin';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'mongopass';
const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_PORT = Number(process.env.MONGO_PORT) || 37018;
const PRODUCTION = JSON.parse((process.env.PRODUCTION || 'false').toLowerCase());

class MongooseService {
    private count = 0;
    private mongooseOptions = {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        socketTimeoutMS: 30000,
        keepAlive: true,
        poolSize: 25,
        autoIndex: false,
        authSource: 'admin',
        // writeConcern: 'majority',
        serverSelectionTimeoutMS: 5000,
        useFindAndModify: false
    };

    constructor() {
        this.connectWithRetry();
    }

    getMongoose() {
        return mongoose;
    }

    connectWithRetry = () => {
        log('Attempting MongoDB connection (will retry if needed)');
        const mongoUrl =
            PRODUCTION === true
                ? `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/pathsport-api`
                : `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/pathsport-api`;
        mongoose
            .connect(mongoUrl, this.mongooseOptions)
            .then(() => {
                log('MongoDB is connected');
            })
            .catch((err) => {
                const retrySeconds = 5;
                log(`MongoDB connection unsuccessful (will retry #${++this.count} after ${retrySeconds} seconds):`, err);
                setTimeout(this.connectWithRetry, retrySeconds * 1000);
            });
    };
}
export default new MongooseService();
