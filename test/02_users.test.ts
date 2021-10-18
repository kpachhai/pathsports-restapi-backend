// import app from '../../app';
import apptest from './01_app.test';
import supertest from 'supertest';
import { expect } from 'chai';
// import shortid from 'shortid';
// import mongoose from 'mongoose';
import init from './00_init.test';

// const firstUserIdTest = apptest.firstUserIdTest;
// const firstUserBody = apptest.firstUserBody;
// const accessToken = apptest.accessToken;
// const refreshToken = apptest.refreshToken;

// let firstUserIdTest = '';
// const firstUserBody = {
//     did: `did:elastos:${shortid.generate()}`,
//     password: 'Sup3rSecret!23',
// };

let request: supertest.SuperAgentTest;
// let accessToken = '';
// let refreshToken = '';
const newFirstName = 'Jose';
const newFirstName2 = 'Paulo';
const newLastName2 = 'Faraco';

(async () => {
    request = await init.getSuperAgentRequest();
})();

describe('users test cases', function () {
    // let request: supertest.SuperAgentTest;
    // before(async function () {
    //     request = await apptest.getSuperAgentRequest();
    //     // request = supertest.agent(app);
    // });
    // after(function (done: Mocha.Done) {
    //     apptest.closeApp(done);
    // });

    // request = await init.getSuperAgentRequest();

    it('should allow a GET from /users/:userId with an access token', async function () {
        const firstUserIdTest = await apptest.getFirstUserId();
        const accessToken = await apptest.getAccessToken();

        // console.log('Waqas: ', firstUserIdTest);
        // console.log('Waqas2: ', accessToken);

        // console.log('Request: ', request);

        const res = await request
            .get(`/users/${firstUserIdTest}`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();
        // console.log('Response:', res);

        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body._id).to.be.a('string');
        expect(res.body._id).to.equal(firstUserIdTest);
        expect(res.body.did).to.equal(apptest.firstUserBody.did);
    });

    describe('with a valid access token', async function () {
        it('should disallow a GET from /users', async function () {
            const accessToken = await apptest.getAccessToken();

            const res = await request
                .get(`/users`)
                .set({
                    Authorization: `Bearer ${accessToken}`,
                })
                .send();
            expect(res.status).to.equal(403);
        });

        it('should disallow a PATCH to /users/:userId', async function () {
            const firstUserIdTest = await apptest.getFirstUserId();
            const accessToken = await apptest.getAccessToken();

            // console.log('Waqas: ', firstUserIdTest);
            // console.log('Waqas2: ', accessToken);

            const res = await request
                .patch(`/users/${firstUserIdTest}`)
                .set({
                    Authorization: `Bearer ${accessToken}`,
                })
                .send({
                    firstName: newFirstName,
                });

            // console.log('Response Waqas: ', res);

            expect(res.status).to.equal(403);
        });

        it('should disallow a PUT to /users/:userId with an nonexistant ID', async function () {
            const res = await request
                .put(`/users/i-do-not-exist`)
                .set({
                    Authorization: `Bearer ${await apptest.getAccessToken()}`,
                })
                .send({
                    did: apptest.firstUserBody.did,
                    password: apptest.firstUserBody.password,
                    firstName: 'Marcos',
                    lastName: 'Silva',
                    permissionLevel: 256,
                });
            expect(res.status).to.equal(404);
        });

        it('should disallow a PUT to /users/:userId trying to change the permission level', async function () {
            const res = await request
                .put(`/users/${await apptest.getFirstUserId()}`)
                .set({
                    Authorization: `Bearer ${await apptest.getAccessToken()}`,
                })
                .send({
                    did: apptest.firstUserBody.did,
                    password: apptest.firstUserBody.password,
                    firstName: 'Marcos',
                    lastName: 'Silva',
                    permissionLevel: 256,
                });
            expect(res.status).to.equal(400);
            expect(res.body.errors).to.be.an('array');
            expect(res.body.errors).to.have.length(1);
            expect(res.body.errors[0]).to.equal(
                'User cannot change permission level'
            );
        });

        it('should allow a PUT to /users/:userId/permissionLevel/2 for testing', async function () {
            const _accessToken = await apptest.getAccessToken();
            const res = await request
                .put(
                    `/users/${await apptest.getFirstUserId()}/permissionLevel/2`
                )
                .set({
                    Authorization: `Bearer ${_accessToken}`,
                })
                .send({});
            expect(res.status).to.equal(204);
        });

        describe('with a new permission level', async function () {
            it('should allow a POST to /auth/refresh-token', async function () {
                this.timeout(5000);
                const _refreshToken = await apptest.getRefreshToken();
                const _accessToken = await apptest.getAccessToken();

                // console.log('_refreshToken: ', _refreshToken);
                // console.log('_accessToken: ', _accessToken);

                const res = await request
                    .post('/auth/refresh-token')
                    .set({
                        Authorization: `Bearer ${_accessToken}`,
                    })
                    .send({ refreshToken: _refreshToken });
                expect(res.status).to.equal(201);
                expect(res.body).not.to.be.empty;
                expect(res.body).to.be.an('object');
                expect(res.body.accessToken).to.be.a('string');
                await apptest.getAccessToken(res.body.accessToken);
                await apptest.getRefreshToken(res.body.refreshToken);
            });

            it('should allow a PUT to /users/:userId to change first and last names', async function () {
                const _firstUserId = await apptest.getFirstUserId();
                const _accessToken = await apptest.getAccessToken();
                const res = await request
                    .put(`/users/${_firstUserId}`)
                    .set({
                        Authorization: `Bearer ${_accessToken}`,
                    })
                    .send({
                        did: apptest.firstUserBody.did,
                        password: apptest.firstUserBody.password,
                        firstName: newFirstName2,
                        lastName: newLastName2,
                        permissionLevel: 2,
                    });
                expect(res.status).to.equal(204);
            });

            it('should allow a GET from /users/:userId and should have a new full name', async function () {
                const res = await request
                    .get(`/users/${await apptest.getFirstUserId()}`)
                    .set({
                        Authorization: `Bearer ${await apptest.getAccessToken()}`,
                    })
                    .send();
                expect(res.status).to.equal(200);
                expect(res.body).not.to.be.empty;
                expect(res.body).to.be.an('object');
                expect(res.body._id).to.be.a('string');
                expect(res.body.firstName).to.equal(newFirstName2);
                expect(res.body.lastName).to.equal(newLastName2);
                expect(res.body.did).to.equal(apptest.firstUserBody.did);
                expect(res.body._id).to.equal(await apptest.getFirstUserId());
            });

            it('should allow a DELETE from /users/:userId', async function () {
                const res = await request
                    .delete(`/users/${await apptest.getFirstUserId()}`)
                    .set({
                        Authorization: `Bearer ${await apptest.getAccessToken()}`,
                    })
                    .send();
                expect(res.status).to.equal(204);
            });
        });
    });
});
