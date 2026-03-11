import { baseUrl } from '../helper/constants';
import { JsonBinController } from '../helper/jsonbin-controller';

describe('JSONBin API - Read Bin', () => {
  const controller = new JsonBinController(baseUrl);

  describe('positive tests', () => {
    let binId: string;
    let createdRecord: Record<string, unknown>;

    beforeEach(async () => {
      createdRecord = {
        user: {
          id: 1,
          email: 'test@example.com',
        },
        roles: ['admin', 'editor'],
        createdAt: '2026-03-07T10:00:00Z',
      };

      const createResponse = await controller.createBin(createdRecord, true, 'read-test-bin');
      const createBody = await createResponse.json();
      expect(createResponse.status).toBe(200);
      binId = createBody.metadata.id;
    })

    test('read created bin', async () => {
      const getResponse = await controller.getBin(binId)
      const getBody = await getResponse.json()
            expect(getResponse.status).toBe(200);
      expect(getBody.record).toEqual(createdRecord);
    })

    test('read created bin without metadata', async () => {
      const getResponse = await controller.getBin(binId, false);
      const getBody = await getResponse.json()
            expect(getResponse.status).toBe(200)
      expect(getBody).toEqual(createdRecord);
    })

    test('read created bin returns correct metadata fields', async () => {
      const getResponse = await controller.getBin(binId, true)
      const getBody = await getResponse.json()

      expect(getResponse.status).toBe(200);
      expect(getBody.metadata).toBeDefined();
      expect(getBody.metadata.id).toBe(binId);
      expect(getBody.metadata.private).toBe(true);
      expect(getBody.metadata.name).toBe('read-test-bin');
    })
  })

  describe('negative tests', () => {

    test('read bin by invalid id', async () => {
      const response = await controller.getBin("123", true)
      const body = await response.json()
      expect(response.status).toBe(400);
      expect(body).toEqual({
        "message": "Invalid Bin Id provided"
      });
    })

    test('read deleted bin', async () => {
      const response = await controller.getBin("69acb9a643b1c97be9bf1311", true)
      const body = await response.json()
      expect(response.status).toBe(404);
      expect(body).toEqual({
        "message": "Bin not found or it doesn't belong to your account"
      });
    })

  })
})
