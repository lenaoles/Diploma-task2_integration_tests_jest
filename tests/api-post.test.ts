import { baseUrl } from '../helper/constants';
import { JsonBinController } from '../helper/jsonbin-controller';


describe('JSONBin API - Create Bin', () => {
    const controller = new JsonBinController(baseUrl);

    test('positive: create private bin with valid JSON', async () => {
        const requestBody = {
            user: {
                id: 12,
                email: 'testlena@example.com',
            },
            roles: ['superadmin', 'private'],
            createdAt: '2026-03-07T10:00:00Z',
        };
        const createResponse = await controller.createBin(requestBody, true, "TestBinNamePrivate");
        const createBody = await createResponse.json()

        expect(createResponse.status).toEqual(200);
        expect(createBody.record).toEqual(requestBody);
        expect(createBody.metadata.id).toBeDefined();
        expect(createBody.metadata.private).toBe(true);
        expect(createBody.metadata.name).toEqual("TestBinNamePrivate")

        const binId = createBody.metadata.id;
        const getResponse = await controller.getBin(binId);
        const getBody = await getResponse.json();

        expect(getResponse.status).toBe(200);
        expect(getBody.record).toEqual(requestBody);
        expect(getBody.metadata.private).toBe(true)
    })

    test('positive: create public bin with valid JSON', async () => {
        const requestBody = {
            user: {
                id: 28,
                email: 'testlena@example.com',
            },
            roles: ['superadmin', 'public'],
            createdAt: '2026-03-07T10:00:00Z',
        };
        const createResponse = await controller.createBin(requestBody, false, "TestBinNamePublic");
        const createBody = await createResponse.json()

        expect(createResponse.status).toEqual(200);
        expect(createBody.record).toEqual(requestBody);
        expect(createBody.metadata.id).toBeDefined();
        expect(createBody.metadata.private).toBe(false);
        expect(createBody.metadata.name).toEqual("TestBinNamePublic")

        const binId = createBody.metadata.id;
        const getResponse = await controller.getBin(binId);
        const getBody = await getResponse.json();

        expect(getResponse.status).toBe(200);
        expect(getBody.record).toEqual(requestBody);
        expect(getBody.metadata.private).toBe(false)
    })

    test('negative: create blank bin', async () => {
        const requestBody = {};
        const response = await controller.createBin(requestBody);
        const body = await response.json()
        expect(response.status).toEqual(400);
        expect(body).toEqual({
            "message": "Bin cannot be blank"
        });
    })    

    test('negative: create bin with invalid JSON', async () => {
        const requestBody = "test";
        const response = await controller.createBin(requestBody);
        const body = await response.json()
        expect(response.status).toEqual(400);
        expect(body).toEqual({
            "message": "Invalid JSON. Please try again"
        });
    })

    test('negative: create bin with invalid X-Bin-Name', async () => {
        const requestBody = {
            "name": "lena"
        };
        const response = await controller.createBin(requestBody, true, "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789");
        const body = await response.json()
        expect(response.status).toEqual(400);
        expect(body).toEqual({
            "message": "X-Bin-Name cannot be blank or over 128 characters"
        });
    })
})