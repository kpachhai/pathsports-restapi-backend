import supertest from 'supertest';
import app from '../src/app';

let request: supertest.SuperAgentTest;

const initApp = async () => {
    before(async function () {
        request = await getSuperAgentRequest();
    });
};

const getSuperAgentRequest = async () => {
    if (request) {
        return request;
    }
    request = supertest.agent(app);
    return request;
};

initApp();

export default {
    getSuperAgentRequest
};
