import apptest from './01_app.test';
import supertest from 'supertest';
import { expect } from 'chai';
import init from './00_init.test';

let request: supertest.SuperAgentTest;

const newFirstName = 'Jose';
const newFirstName2 = 'Paulo';
const newLastName2 = 'Faraco';

(async () => {
    request = await init.getSuperAgentRequest();
})();

describe('users test cases', () => {
    it('should allow a GET from /users/:userId with an access token', async () => {
        const firstUserIdTest = await apptest.getFirstUserId();
        const accessToken = await apptest.getAccessToken();

        const res = await request
            .get(`/users/${firstUserIdTest}`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();

        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body._id).to.be.a('string');
        expect(res.body._id).to.equal(firstUserIdTest);
        expect(res.body.did).to.equal(apptest.firstUserBody.did);
    });

    describe('with a valid access token', async () => {
        it('should disallow a GET from /users', async () => {
            const accessToken = await apptest.getAccessToken();

            const res = await request
                .get(`/users`)
                .set({
                    Authorization: `Bearer ${accessToken}`
                })
                .send();
            expect(res.status).to.equal(403);
        });

        it('should disallow a PATCH to /users/:userId', async () => {
            const firstUserIdTest = await apptest.getFirstUserId();
            const accessToken = await apptest.getAccessToken();

            const res = await request
                .patch(`/users/${firstUserIdTest}`)
                .set({
                    Authorization: `Bearer ${accessToken}`
                })
                .send({
                    firstName: newFirstName
                });

            expect(res.status).to.equal(403);
        });

        it('should disallow a PUT to /users/:userId with an nonexistant ID', async () => {
            const res = await request
                .put(`/users/i-do-not-exist`)
                .set({
                    Authorization: `Bearer ${await apptest.getAccessToken()}`
                })
                .send({
                    did: apptest.firstUserBody.did,
                    password: apptest.firstUserBody.password,
                    firstName: 'Marcos',
                    lastName: 'Silva',
                    permissionLevel: 256
                });
            expect(res.status).to.equal(404);
        });

        it('should disallow a PUT to /users/:userId trying to change the permission level', async () => {
            const res = await request
                .put(`/users/${await apptest.getFirstUserId()}`)
                .set({
                    Authorization: `Bearer ${await apptest.getAccessToken()}`
                })
                .send({
                    did: apptest.firstUserBody.did,
                    password: apptest.firstUserBody.password,
                    firstName: 'Marcos',
                    lastName: 'Silva',
                    permissionLevel: 256
                });
            expect(res.status).to.equal(400);
            expect(res.body.errors).to.be.an('array');
            expect(res.body.errors).to.have.length(1);
            expect(res.body.errors[0]).to.equal('User cannot change permission level');
        });

        it('should allow a PUT to /users/:userId/permissionLevel/2 for testing', async () => {
            const _accessToken = await apptest.getAccessToken();
            const res = await request
                .put(`/users/${await apptest.getFirstUserId()}/permissionLevel/2`)
                .set({
                    Authorization: `Bearer ${_accessToken}`
                })
                .send({});
            expect(res.status).to.equal(204);
        });

        describe('with a new permission level', async () => {
            it('should allow a POST to /auth/refresh-token', async function () {
                this.timeout(5000);
                const _refreshToken = await apptest.getRefreshToken();
                const _accessToken = await apptest.getAccessToken();

                const res = await request
                    .post('/auth/refresh-token')
                    .set({
                        Authorization: `Bearer ${_accessToken}`
                    })
                    .send({ refreshToken: _refreshToken });
                expect(res.status).to.equal(201);
                expect(res.body).not.to.be.empty;
                expect(res.body).to.be.an('object');
                expect(res.body.accessToken).to.be.a('string');
                await apptest.getAccessToken(res.body.accessToken);
                await apptest.getRefreshToken(res.body.refreshToken);
            });

            it('should allow a PUT to /users/:userId to change first and last names', async () => {
                const _firstUserId = await apptest.getFirstUserId();
                const _accessToken = await apptest.getAccessToken();
                const res = await request
                    .put(`/users/${_firstUserId}`)
                    .set({
                        Authorization: `Bearer ${_accessToken}`
                    })
                    .send({
                        did: apptest.firstUserBody.did,
                        password: apptest.firstUserBody.password,
                        firstName: newFirstName2,
                        lastName: newLastName2,
                        permissionLevel: 2
                    });
                expect(res.status).to.equal(204);
            });

            it('should allow a GET from /users/:userId and should have a new full name', async () => {
                const res = await request
                    .get(`/users/${await apptest.getFirstUserId()}`)
                    .set({
                        Authorization: `Bearer ${await apptest.getAccessToken()}`
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

            it('should allow a DELETE from /users/:userId', async () => {
                const res = await request
                    .delete(`/users/${await apptest.getFirstUserId()}`)
                    .set({
                        Authorization: `Bearer ${await apptest.getAccessToken()}`
                    })
                    .send();
                expect(res.status).to.equal(204);
            });
        });
    });
});
