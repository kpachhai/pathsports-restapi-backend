import { expect } from 'chai';
import supertest from 'supertest';
import apptest from './01_app.test';
import init from './00_init.test';

let request: supertest.SuperAgentTest;
const newName = 'Awesome Neymar';

(async () => {
    request = await init.getSuperAgentRequest();
})();

describe('players test cases', function () {
    it('should disallow a GET from /players', async function () {
        const res = await request.get(`/players`).send();
        expect(res.status).to.equal(401);
    });

    describe('with a valid access token', async function () {
        it('should allow a POST to /players', async function () {
            this.timeout(5000);
            const _accessToken = await apptest.getPlayerAccessToken();

            const res = await request
                .post(`/players`)
                .set({ Authorization: `Bearer ${_accessToken}` })
                .send(apptest.firstPlayerBody);

            expect(res.status).to.equal(201);
            expect(res.body).not.to.be.empty;
            expect(res.body).to.be.an('object');
            expect(res.body.id).to.be.an('string');
            await apptest.getFirstPlayerId(res.body.id);
        });

        it('should allow a GET from /players/:playerDid with an access token', async function () {
            const _accessToken = await apptest.getPlayerAccessToken();
            const res = await request
                .get(`/players/${apptest.firstPlayerBody.did}`)
                .set({
                    Authorization: `Bearer ${_accessToken}`,
                })
                .send();
            expect(res.status).to.equal(200);
            expect(res.body).not.to.be.empty;
            expect(res.body).to.be.an('object');
            expect(res.body._id).to.be.a('string');
            expect(res.body._id).to.equal(await apptest.getFirstPlayerId());
            expect(res.body.did).to.equal(apptest.firstPlayerBody.did);
        });

        it('should allow a GET from /players', async function () {
            const res = await request
                .get(`/players`)
                .set({
                    Authorization: `Bearer ${await apptest.getAdminAccessToken()}`,
                })
                .send();
            expect(res.status).to.equal(200);
        });

        it('should allow a PATCH to /players/:playerDid to change jersey name', async function () {
            const _accessToken = await apptest.getPlayerAccessToken();
            const res = await request
                .patch(`/players/${apptest.firstPlayerBody.did}`)
                .set({
                    Authorization: `Bearer ${_accessToken}`,
                })
                .send({
                    name: newName,
                });
            expect(res.status).to.equal(204);
        });

        it('should allow a PATCH to /players/:playerDid/stats to add statistics', async function () {
            const _accessToken = await apptest.getPlayerAccessToken();
            const res = await request
                .patch(`/players/${apptest.firstPlayerBody.did}/stats`)
                .set({
                    Authorization: `Bearer ${_accessToken}`,
                })
                .send({
                    match: {
                        match_date: '2021-12-05',
                        opponent_team: 'Montpellier',
                        team_score: 2,
                        opponent_score: 2,
                        league: '',
                    },
                    football: {
                        assists: 0,
                        fouls_suffered: 0,
                        fouls_committed: 1,
                        total_goals: 0,
                        offsides: 0,
                        red_cards: 0,
                        shots: 1,
                        shots_on_target: 0,
                        starts: 0,
                        yellow_cards: 1,
                    },
                });
            expect(res.status).to.equal(204);
        });

        it('should allow a GET from /players/:playerDid and should have a new jersey name', async function () {
            const _accessToken = await apptest.getPlayerAccessToken();
            const res = await request
                .get(`/players/${apptest.firstPlayerBody.did}`)
                .set({
                    Authorization: `Bearer ${_accessToken}`,
                })
                .send();
            expect(res.status).to.equal(200);
            expect(res.body).not.to.be.empty;
            expect(res.body).to.be.an('object');
            expect(res.body._id).to.be.a('string');
            expect(res.body.name).to.equal(newName);
            expect(res.body.did).to.equal(apptest.firstPlayerBody.did);
            expect(res.body._id).to.equal(await apptest.getFirstPlayerId());
        });

        it('should allow a DELETE from /players/:playerDid', async function () {
            const _accessToken = await apptest.getPlayerAccessToken();
            const res = await request
                .delete(`/players/${apptest.firstPlayerBody.did}`)
                .set({
                    Authorization: `Bearer ${_accessToken}`,
                })
                .send();
            expect(res.status).to.equal(204);
        });
    });
});