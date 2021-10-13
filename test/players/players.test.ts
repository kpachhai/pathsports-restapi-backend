import app from '../../app';
import supertest from 'supertest';
import { expect } from 'chai';
import shortid from 'shortid';
import mongoose from 'mongoose';

let firstUserIdTest = '';
let firstPlayerIdTest = '';
let firstPlayerDid = 'did:elastos:ipsGDumwoBti6iwPF8rWHqFg2ishQ9yHdH';
const firstUserBody = {
    email: `wakqasahmed+${shortid.generate()}@tuum.tech`,
    password: 'Sup3rSecret!23',
};

const firstPlayerBody = {
    did: firstPlayerDid,
    firstName: 'Neymar',
    lastName: 'da Silva Santos Júnior',
};

let accessToken = '';
let refreshToken = '';
const newName = 'Awesome Neymar';

describe('users and auth endpoints from players test cases', function () {
    let request: supertest.SuperAgentTest;
    before(function () {
        request = supertest.agent(app);
    });
    after(function (done) {
        // shut down the Express.js server, close our MongoDB connection, then tell Mocha we're done:
        app.close(() => {
            mongoose.connection.close(done);
        });
    });

    it('should allow a POST to /users', async function () {
        const res = await request.post('/users').send(firstUserBody);

        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body.id).to.be.an('string');
        firstUserIdTest = res.body.id;
    });

    it('should allow a POST to /auth', async function () {
        const res = await request.post('/auth').send(firstUserBody);
        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body.accessToken).to.be.a('string');
        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
    });

    it('should disallow a GET from /players', async function () {
        const res = await request.get(`/players`).send();
        expect(res.status).to.equal(401);
    });

    describe('with a valid access token', async function () {
        // it('should allow a PUT to /users/:userId/permissionLevel/2 for testing', async function () {
        //     const res = await request
        //         .put(`/users/${firstUserIdTest}/permissionLevel/2`)
        //         .set({ Authorization: `Bearer ${accessToken}` })
        //         .send({});
        //     expect(res.status).to.equal(204);
        // });

        it('should allow a POST to /players', async function () {
            const res = await request
                .post(`/players`)
                .set({ Authorization: `Bearer ${accessToken}` })
                .send(firstPlayerBody);

            expect(res.status).to.equal(201);
            expect(res.body).not.to.be.empty;
            expect(res.body).to.be.an('object');
            expect(res.body.id).to.be.an('string');
            firstPlayerIdTest = res.body.id;
        });

        it('should allow a GET from /players/:playerDid with an access token', async function () {
            const res = await request
                .get(`/players/${firstPlayerDid}`)
                .set({ Authorization: `Bearer ${accessToken}` })
                .send();
            expect(res.status).to.equal(200);
            expect(res.body).not.to.be.empty;
            expect(res.body).to.be.an('object');
            expect(res.body._id).to.be.a('string');
            expect(res.body._id).to.equal(firstPlayerIdTest);
            expect(res.body.did).to.equal(firstPlayerBody.did);
        });

        it('should allow a GET from /players', async function () {
            const res = await request
                .get(`/players`)
                .set({ Authorization: `Bearer ${accessToken}` })
                .send();
            expect(res.status).to.equal(200);
        });

        it('should allow a PATCH to /players/:playerDid to change jersey name', async function () {
            const res = await request
                .patch(`/players/${firstPlayerDid}`)
                .set({ Authorization: `Bearer ${accessToken}` })
                .send({
                    name: newName,
                });
            expect(res.status).to.equal(204);
        });

        it('should allow a PATCH to /players/:playerDid/stats to add statistics', async function () {
            const res = await request
                .patch(`/players/${firstPlayerDid}/stats`)
                .set({ Authorization: `Bearer ${accessToken}` })
                .send({
                    team: {
                        did: 'did:elastos:RaNdOmDiD',
                        name: 'Paris Saint Germain',
                        logo: 'https://media.api-sports.io/football/teams/85.png',
                    },
                    goals: {
                        total: 9,
                        assists: 5,
                        saves: null,
                    },
                });
            expect(res.status).to.equal(204);
        });

        it('should allow a GET from /players/:playerDid and should have a new jersey name', async function () {
            const res = await request
                .get(`/players/${firstPlayerDid}`)
                .set({ Authorization: `Bearer ${accessToken}` })
                .send();
            expect(res.status).to.equal(200);
            expect(res.body).not.to.be.empty;
            expect(res.body).to.be.an('object');
            expect(res.body._id).to.be.a('string');
            expect(res.body.name).to.equal(newName);
            expect(res.body.did).to.equal(firstPlayerBody.did);
            expect(res.body._id).to.equal(firstPlayerIdTest);
        });

        it('should allow a DELETE from /players/:playerDid', async function () {
            const res = await request
                .delete(`/players/${firstPlayerDid}`)
                .set({ Authorization: `Bearer ${accessToken}` })
                .send();
            expect(res.status).to.equal(204);
        });
    });
});
