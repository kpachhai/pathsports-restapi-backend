import app from '../src/app';
import mongoose from 'mongoose';
import apptest from './01_app.test';
import supertest from 'supertest';
import init from './00_init.test';
import { expect } from 'chai';

let request: supertest.SuperAgentTest;

(async () => {
    request = await init.getSuperAgentRequest();
})();

const cleanUp = () => {
    it('should cleanup users created for testing', async () => {
        const resAdmin = await request
            .delete(`/users/${apptest.adminUserId}`)
            .set({
                Authorization: `Bearer ${await apptest.getAdminAccessToken()}`
            })
            .send();
        expect(resAdmin.status).to.equal(204);

        const resPlayer = await request
            .delete(`/users/${apptest.playerUserId}`)
            .set({
                Authorization: `Bearer ${await apptest.getPlayerAccessToken()}`
            })
            .send();
        expect(resPlayer.status).to.equal(204);
    });
};

// const closeApp = async () => {
const closeApp = async (done: Mocha.Done) => {
    // shut down the Express.js server, close our MongoDB connection, then tell Mocha we're done:
    app.close(() => {
        console.log('Express app closed successfully.');
        mongoose.connection.close(done);
        // mongoose.connection.close();
    });
};

after(function (done) {
    cleanUp();
    closeApp(done);
});
