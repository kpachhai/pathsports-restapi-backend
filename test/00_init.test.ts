import supertest from 'supertest';
import app from '../app';

let request: supertest.SuperAgentTest;

const initApp = async () => {
    before(async function () {
        request = await getSuperAgentRequest();
        // request = supertest.agent(app);
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
    getSuperAgentRequest,
};
