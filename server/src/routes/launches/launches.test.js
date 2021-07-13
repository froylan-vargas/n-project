const request = require('supertest');
const app = require('../../app');
const {
    mongoConnect,
    mongoDisconnect
} = require('../../services/mongo');

describe('Launches API', () => {
    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    const version = '/v1';

    describe('Test GET /launches', () => {
        test('it should respond with 200 success', async () => {
            await request(app)
                .get(`${version}/launches`)
                .expect('Content-Type', /json/)
                .expect(200)
        });
    });

    describe('Test POST /launch', () => {

        const completeLaunchData = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-1652 b',
            launchDate: 'January 4, 2028'
        };

        const launchDataWithoutDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-1652 b'
        };

        const launchDataWithInvalidDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-1652 b',
            launchDate: 'zoot'
        };

        test('it should response with 201 created', async () => {
            const response = await request(app)
                .post(`${version}/launches`)
                .send(completeLaunchData)
                .expect(201);

            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();

            expect(responseDate).toBe(requestDate);

            expect(response.body).toMatchObject(launchDataWithoutDate);
        });

        test('it should catch missing required properties', async () => {
            const response = await request(app)
                .post(`${version}/launches`)
                .send(launchDataWithoutDate)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Missing required launch info'
            });
        });

        test('it should catch invalid dates', async () => {
            const response = await request(app)
                .post(`${version}/launches`)
                .send(launchDataWithInvalidDate)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Invalid launch date'
            });
        });
    });
});