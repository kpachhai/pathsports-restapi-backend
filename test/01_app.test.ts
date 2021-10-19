import { expect } from 'chai';
describe('Index Test', function () {
    it('should always pass', function () {
        expect(true).to.equal(true);
    });
});

import init from './00_init.test';
import supertest from 'supertest';
import shortid from 'shortid';

let request: supertest.SuperAgentTest;
let firstUserIdTest = '';
let firstPlayerIdTest = '';
let firstUserAccessToken = '';
let adminAccessToken = '';
let playerAccessToken = '';
let secondUserAccessToken = '';
let refreshToken = '';
let adminUserId = '';
let playerUserId = '';

const tempPassword = 'tEmPp@ssw0rd';

const firstUserBody = {
    did: `did:elastos:${shortid.generate()}`,
    password: 'Sup3rSecret!23',
};

const secondUserBody = {
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
    permissionLevel: 2,
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
    if (firstUserAccessToken != '' && _accessToken == '') {
        return firstUserAccessToken;
    }

    firstUserAccessToken = _accessToken;
    return firstUserAccessToken;
};

const getSecondAccessToken = async (_accessToken = '') => {
    if (secondUserAccessToken != '' && _accessToken == '') {
        return secondUserAccessToken;
    }

    secondUserAccessToken = _accessToken;
    return secondUserAccessToken;
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
    it('should allow a POST to /users', async function () {
        const res = await createUser(firstUserBody);

        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body.id).to.be.an('string');
        firstUserIdTest = await getFirstUserId(res.body.id);
    });

    it('should allow a POST to /auth', async function () {
        let tempUser = firstUserBody;
        tempUser.password = tempPassword;
        const res = await generateAuthToken(firstUserBody);

        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body.accessToken).to.be.a('string');
        firstUserAccessToken = await getAccessToken(res.body.accessToken);
        refreshToken = await getRefreshToken(res.body.refreshToken);
    });

    it('should be able to regenerate auth token with new password', async function () {
        const res = await generateAuthToken(firstUserBody);

        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body.accessToken).to.be.a('string');
        firstUserAccessToken = await getAccessToken(res.body.accessToken);
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
    });

    it('should be able to generate player access token for player testing', async function () {
        const resUser = await createUser(playerUserBody);
        const resAuth = await generateAuthToken(playerUserBody);

        playerUserId = resUser.body.id;

        expect(resAuth.body.accessToken).to.be.a('string');
        playerAccessToken = resAuth.body.accessToken;
        expect(resAuth.status).to.equal(201);
    });

    it('should be able to generate second user access token for player testing', async function () {
        const resUser = await createUser(secondUserBody);
        const resAuth = await generateAuthToken(secondUserBody);

        expect(resAuth.body.accessToken).to.be.a('string');
        secondUserAccessToken = resAuth.body.accessToken;
        expect(resAuth.status).to.equal(201);
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
    firstUserBody,
    getFirstUserId,
    getAccessToken,
    getRefreshToken,
    firstPlayerBody,
    getFirstPlayerId,
    getAdminAccessToken,
    getPlayerAccessToken,
    playerUserId,
    adminUserId,
    getSecondAccessToken,
    secondUserBody,
};
