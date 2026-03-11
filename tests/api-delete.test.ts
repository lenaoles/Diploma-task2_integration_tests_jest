import { baseUrl } from '../helper/constants';
import { JsonBinController } from '../helper/jsonbin-controller';

describe('JSONBin API - Delete Bin', () => {
    const controller = new JsonBinController(baseUrl);

    let binId: string;
    let createdRecord: Record<string, unknown>;

    beforeEach(async () => {
        createdRecord = {
            name: 'deleteMe'
        };
        const createResponse = await controller.createBin(createdRecord, true, 'delete-test-bin');
        const createBody = await createResponse.json();
        expect(createResponse.status).toBe(200);
        binId = createBody.metadata.id;
    })

    test('positive: delete created bin', async () => {
        const deleteResponse = await controller.deleteBin(binId)
        const deleteBody = await deleteResponse.json()
        expect(deleteResponse.status).toBe(200);
        expect(deleteBody.metadata.id).toEqual(binId);
        expect(deleteBody.message).toBe("Bin deleted successfully");

        const getResponse = await controller.getBin(binId, true);
        const getBody = await getResponse.json();
        expect(getResponse.status).toBe(404);
        expect(getBody).toEqual({
            message: "Bin not found or it doesn't belong to your account"
        });
    })

    test('positive: delete response contains versionsDeleted field', async () => {
        const deleteResponse = await controller.deleteBin(binId);
        const deleteBody = await deleteResponse.json();

        expect(deleteResponse.status).toBe(200);
        expect(deleteBody.metadata.id).toBe(binId);
        expect(deleteBody.metadata.versionsDeleted).toBeDefined();
        expect(typeof deleteBody.metadata.versionsDeleted).toBe('number');
        expect(deleteBody.message).toBe('Bin deleted successfully');
    })

    test('negative: delete bin by invalid id', async () => {
        const response = await controller.deleteBin("123")
        const body = await response.json()
        const expectedError = {
            "message": "Invalid Bin Id provided"
        }
        expect(response.status).toBe(400);
        expect(body).toEqual(expectedError);
    })

    test('negative: deleting the same bin second time returns 404', async () => {
        const firstDeleteResponse = await controller.deleteBin(binId)
        const firstDeleteBody = await firstDeleteResponse.json()

        expect(firstDeleteResponse.status).toBe(200);
        expect(firstDeleteBody.message).toBe('Bin deleted successfully');

        const secondDeleteResponse = await controller.deleteBin(binId);
        const secondDeleteBody = await secondDeleteResponse.json();

        expect(secondDeleteResponse.status).toBe(404);
        expect(secondDeleteBody).toEqual({
            "message": "Bin not found or it doesn't belong to your account"
        });
    })
})