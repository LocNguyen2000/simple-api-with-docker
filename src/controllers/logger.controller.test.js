import { mockLogger } from '../mocks/loggerData.mjs';
import { addLog, updateLog, getLog } from '../../controllers/logger.controller.mjs';

let mockRequest, mockResponse, mockNext;

import Logger from '../../models/logger.mjs';

describe('Logger controller', () => {
  describe('get', () => {
    beforeEach(() => {
      mockRequest = {
        query: {
          user: null,
          startAt: null,
          endAt: null,
          p: null,
        },
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      mockNext = jest.fn();

      Logger.countDocuments = jest.fn();

      jest.spyOn(Logger, "find").mockImplementationOnce(() => ({
        limit: () => ({
            skip: jest.fn().mockResolvedValue([mockLogger]),
        }),
    }));
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    //chưa test được

    test('success: get log messages', async () => {
      mockRequest.query.p = 1;
      mockRequest.query.user = 'test';

      let count = 1;
      Logger.countDocuments.mockResolvedValue(count);

      let result = await getLog(mockRequest, mockResponse, mockNext);

      expect(result.status.mock.calls[0][0]).toEqual(200);
      expect(result.json.mock.calls[0][0]).toEqual({
        data: {
          rows: [mockLogger],
          count,
        },
      });
    });
    test('success: get log messages with query startAt', async () => {
        mockRequest.query.p = 1
        mockRequest.query.user = 'test'
        mockRequest.query.startAt = new Date()
        let count = 1
        Logger.countDocuments.mockResolvedValue(count)

        let result = await getLog(mockRequest, mockResponse, mockNext)

        expect(result.status.mock.calls[0][0]).toEqual(200);
        expect(result.json.mock.calls[0][0]).toEqual({data: {
            rows: [mockLogger],
            count,
          },})
    })
    test('success: get log messages with query endAt', async () => {
        mockRequest.query.p = 1
        mockRequest.query.user = 'test'
        mockRequest.query.endAt = new Date()
        let count = 1
        Logger.countDocuments.mockResolvedValue(count)

        let result = await getLog(mockRequest, mockResponse, mockNext)

        expect(result.status.mock.calls[0][0]).toEqual(200);
        expect(result.json.mock.calls[0][0]).toEqual({data: {
            rows: [mockLogger],
            count,
          },})
    })
    test('error: server fail with status 500', async () => {
      mockRequest.query.p = 1;
      mockRequest.query.user = 'test';
      mockRequest.query.endAt = new Date();

      let error = new Error('Server error fail');

      Logger.countDocuments.mockRejectedValue(error);

      await getLog(mockRequest, mockResponse, mockNext);

      expect(mockNext.mock.calls[0][0]).toEqual(error);
    });
  });
  describe('post', () => {
    beforeEach(() => {
      mockRequest = {
        body: {
          level: 'error',
          message: null,
        },
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      mockNext = jest.fn();
      Logger.create = jest.fn();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('success: add log successfully', async () => {
      mockRequest.body.message = 'test';

      Logger.create.mockResolvedValue(mockLogger);

      let result = await addLog(mockRequest, mockResponse, mockNext);
      expect(result.status.mock.calls[0][0]).toEqual(201);
      expect(result.json.mock.calls[0][0]).toEqual({ data: mockLogger });
    });
    test('error: server fail with status 500', async () => {
      mockRequest.body.message = 'test';

      let error = new Error('Server error fail');

      Logger.create.mockRejectedValue(error);

      await addLog(mockRequest, mockResponse, mockNext);

      expect(mockNext.mock.calls[0][0]).toEqual(error);
    });
  });
  describe('put', () => {
    beforeEach(() => {
      mockRequest = {
        body: null,
        params: {
          id: null,
        },
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      mockNext = jest.fn();

      Logger.findOneAndUpdate = jest.fn();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('success', async () => {
      mockRequest.body = mockLogger;
      mockRequest.params.id = 1;

      Logger.findOneAndUpdate.mockResolvedValue(mockLogger);

      let result = await updateLog(mockRequest, mockResponse, mockNext);
      expect(result.status.mock.calls[0][0]).toEqual(200);
      expect(result.json.mock.calls[0][0]).toEqual({ data: mockLogger });
    });
    test('error: server fail with status 500', async () => {
      mockRequest.body = mockLogger;
      mockRequest.params.id = 1;

      let error = new Error('Server error fail');

      Logger.findOneAndUpdate.mockRejectedValue(error);

      await updateLog(mockRequest, mockResponse, mockNext);

      expect(mockNext.mock.calls[0][0]).toEqual(error);
    });
  });
});
