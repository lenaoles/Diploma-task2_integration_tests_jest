import { baseUrl } from '../helper/constants';
import { JsonBinController } from '../helper/jsonbin-controller';

describe('JSONBin API - Update Bin', () => {
    const controller = new JsonBinController(baseUrl);

    let binId: string;
    let createdRecord: Record<string, unknown>;

    beforeAll(async () => {
        createdRecord = {
            "name": "lena"
        };
        const createResponse = await controller.createBin(createdRecord, true, 'update-test-bin');
        const createBody = await createResponse.json();
        expect(createResponse.status).toBe(200);
        binId = createBody.metadata.id;
    })

    test('positive: update created bin without versioning', async () => {
        const requestBody = {
            user: {
                id: 12,
                email: 'testlena@example.com',
                name: "lena"
            },
            roles: ['superadmin', 'private'],
            createdAt: '2026-03-07T10:00:00Z',
        };
        const updateResponse = await controller.updateBin(binId, requestBody, false);
        const updateBody = await updateResponse.json()

        expect(updateResponse.status).toEqual(200);
        expect(updateBody.record).toEqual(requestBody);
        expect(updateBody.metadata.parentId).toBeDefined();

        const getResponse = await controller.getBin(binId);
        const getBody = await getResponse.json();

        expect(getResponse.status).toBe(200);
        expect(getBody.record).toEqual(requestBody);
    })

    test('negative: update bin by invalid id', async () => {
        const requestBody = {
            "name": "lena"
        };
        const response = await controller.updateBin("123", requestBody)
        const body = await response.json()
        expect(response.status).toBe(400);
        expect(body).toEqual({
            "message": "Invalid Bin Id provided"
        });
    })

    test('negative: update bin with blank json', async () => {
        const requestBody = {};
        const response = await controller.updateBin(binId, requestBody);
        const body = await response.json()
        expect(response.status).toEqual(400);
        expect(body).toEqual({
            "message": "Bin cannot be blank"
        });
    })

    test('negative: update bin with invalid JSON', async () => {
        const requestBody = "test";
        const response = await controller.updateBin(binId, requestBody)
        const body = await response.json()
        expect(response.status).toBe(400);
        expect(body).toEqual({
            "message": "Invalid JSON. Please try again"
        });
    })

    test('negative: update created bin with versioning', async () => {
        const requestBody = {
            "name": "lena"
        };
        const response = await controller.updateBin(binId, requestBody, true)
        const body = await response.json()
        expect(response.status).toBe(403);
        expect(body).toEqual({
            "message": "Versioning is not available for the Free users. Upgrade to Pro plan http://api.jsonbin.io/pricing to avail this feature"
        });
    })

})
