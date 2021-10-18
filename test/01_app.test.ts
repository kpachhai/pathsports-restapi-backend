import { expect } from 'chai';
describe('Index Test', function () {
    it('should always pass', function () {
        expect(true).to.equal(true);
    });
});

import init from './00_init.test';
import supertest from 'supertest';
// import app from '../app';
import shortid from 'shortid';
import mongoose from 'mongoose';
import { log } from 'debug';

let request: supertest.SuperAgentTest;
let firstUserIdTest = '';
let firstPlayerIdTest = '';
let accessToken = '';
let adminAccessToken = '';
let playerAccessToken = '';
let refreshToken = '';
let adminUserId = '';
let playerUserId = '';

const tempPassword = 'tEmPp@ssw0rd';

const firstUserBody = {
    did: `did:elastos:${shortid.generate()}`,
    password: 'Sup3rSecret!23',
};

const adminUserBody = {
    did: `did:elastos:${shortid.generate()}`,
    password: 'Sup3rSecret!2345',
};

const playerUserBody = {
    did: `did:elastos:${shortid.generate()}`,
    password: 'Sup3rSecret!2345',
};

const firstPlayerBody = {
    did: playerUserBody.did,
    firstName: 'Neymar',
    lastName: 'da Silva Santos Júnior',
};

const createUser = async (userBody: any) => {
    const resUser = await request.post('/users').send(userBody);
    return resUser;
};

const generateAuthToken = async (userBody: any) => {
    const resAuth = await request.post('/auth').send(userBody);
    return resAuth;
};

const getFirstUserId = async (id = '') => {
    if (firstUserIdTest != '') {
        return firstUserIdTest;
    }

    firstUserIdTest = id;
    return firstUserIdTest;
};

const getAccessToken = async (_accessToken = '') => {
    // console.log('accessToken: ', accessToken);

    if (accessToken != '' && _accessToken == '') {
        return accessToken;
    }

    accessToken = _accessToken;
    return accessToken;
};

const getRefreshToken = async (_refreshToken = '') => {
    if (refreshToken != '' && _refreshToken == '') {
        return refreshToken;
    }

    refreshToken = _refreshToken;
    return refreshToken;
};

const getAdminAccessToken = async () => {
    return adminAccessToken;
};

const getPlayerAccessToken = async () => {
    return playerAccessToken;
};

(async () => {
    request = await init.getSuperAgentRequest();
})();

describe('setup test cases', function () {
    // before(async function () {
    //     request = await getSuperAgentRequest();
    //     // request = supertest.agent(app);
    // });
    // after(function (done) {
    //     // shut down the Express.js server, close our MongoDB connection, then tell Mocha we're done:
    //     app.close(() => {
    //         mongoose.connection.close(done);
    //     });
    //     // setTimeout(() => {
    //     //     console.log('After from App is called.');
    //     //     closeApp(done);
    //     // }, 30000);
    // });

    it('should allow a POST to /users', async function () {
        // const res = await request.post('/users').send(firstUserBody);
        const res = await createUser(firstUserBody);

        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body.id).to.be.an('string');
        firstUserIdTest = await getFirstUserId(res.body.id);
    });

    it('should allow a POST to /auth', async function () {
        // const res = await request.post('/auth').send(firstUserBody);
        let tempUser = firstUserBody;
        tempUser.password = tempPassword;
        const res = await generateAuthToken(firstUserBody);

        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body.accessToken).to.be.a('string');
        accessToken = await getAccessToken(res.body.accessToken);
        refreshToken = await getRefreshToken(res.body.refreshToken);
    });

    it('should be able to regenerate auth token with new password', async function () {
        // const res = await request.post('/auth').send(firstUserBody);
        const res = await generateAuthToken(firstUserBody);

        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body.accessToken).to.be.a('string');
        accessToken = await getAccessToken(res.body.accessToken);
        refreshToken = await getRefreshToken(res.body.refreshToken);
    });

    it('should be able to generate admin access token for admin testing', async function () {
        const resUser = await createUser(adminUserBody);
        const resAuth = await generateAuthToken(adminUserBody);

        adminUserId = resUser.body.id;

        const res = await request
            .put(`/users/${resUser.body.id}/permissionLevel/8`)
            .set({
                Authorization: `Bearer ${resAuth.body.accessToken}`,
            })
            .send({});
        const resAuth2 = await generateAuthToken(adminUserBody);
        expect(resAuth2.body.accessToken).to.be.a('string');
        adminAccessToken = resAuth2.body.accessToken;
        expect(resAuth2.status).to.equal(201);
        // expect(res.status).to.equal(204);
    });

    it('should be able to generate player access token for player testing', async function () {
        const resUser = await createUser(playerUserBody);
        const resAuth = await generateAuthToken(playerUserBody);

        playerUserId = resUser.body.id;

        const res = await request
            .put(`/users/${resUser.body.id}/permissionLevel/2`)
            .set({
                Authorization: `Bearer ${resAuth.body.accessToken}`,
            })
            .send({});
        const resAuth2 = await generateAuthToken(playerUserBody);
        expect(resAuth2.body.accessToken).to.be.a('string');
        playerAccessToken = resAuth2.body.accessToken;
        expect(resAuth2.status).to.equal(201);
        // expect(res.status).to.equal(204);
    });
});

const getFirstPlayerId = async (id = '') => {
    if (firstPlayerIdTest != '') {
        return firstPlayerIdTest;
    }

    firstPlayerIdTest = id;
    return firstPlayerIdTest;
};

export default {
    // getSuperAgentRequest,
    firstUserBody,
    getFirstUserId,
    getAccessToken,
    getRefreshToken,
    // closeApp,
    firstPlayerBody,
    getFirstPlayerId,
    getAdminAccessToken,
    getPlayerAccessToken,
    playerUserId,
    adminUserId,
};
