import { SECRET_KEY } from '../tests/env/env.mjs';
import config from '../config/config.mjs';
import { mockDataInfo } from '../tests/mocks/dataInfo.mjs';
import { verifyToken, isAccess } from './authenticate.mjs';
import { jwtGenerate } from '../utils/security.mjs';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ROLE } from '../config/variables.mjs';
let mockRequest, mockResponse, mockNext;
describe('Middleware controller', () => {
  beforeAll(() => {
    config.secretKey = SECRET_KEY;
  });
  describe('verify token', () => {
    beforeEach(() => {
      mockRequest = {
        username: null,
        employeeNumber: null,
        customerNumber: null,
        role: null,
        officeCode: null,
        cookies: {
          access_token: null,
        },
        headers: {
          'x-api-key': null,
        },
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      mockNext = jest.fn();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('success: verify token successfully', async () => {
      let token = jwtGenerate(mockDataInfo);

      mockRequest.cookies.access_token = token;

      await verifyToken(mockRequest, mockResponse, mockNext);
      expect(mockRequest.username).toEqual(mockDataInfo.username);
      expect(mockRequest.employeeNumber).toEqual(mockDataInfo.employeeNumber);
      expect(mockRequest.customerNumber).toEqual(mockDataInfo.customerNumber);
      expect(mockRequest.role).toEqual(mockDataInfo.role);
      expect(mockRequest.officeCode).toEqual(mockDataInfo.officeCode);
      expect(mockNext).toHaveBeenCalled();
    });
    test('error: please login', async () => {
      mockRequest.cookies.access_token = null;

      let result = await verifyToken(mockRequest, mockResponse, mockNext);
      expect(result.status.mock.calls[0][0]).toEqual(400);
      expect(result.json.mock.calls[0][0]).toEqual({ success: false, message: 'Please Login' });
    });
    test('error: Server error fail', async () => {
      let token = jwtGenerate(mockDataInfo);
      mockRequest.cookies.access_token = token;
      mockRequest.cookies['x-api-key'] = null;
      config.secretKey = '123';

      let error = new JsonWebTokenError('invalid signature');

      await verifyToken(mockRequest, mockResponse, mockNext);
      expect(mockNext.mock.calls[0][0]).toEqual(error);
    });
  });

  describe('isAccess', () => {
    beforeEach(() => {
      mockRequest = {
        role: null,
        headers: {
          'x-api-key': null,
        },
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      mockNext = jest.fn();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('success: allow', async () => {
      let roles = [ROLE.PRESIDENT, ROLE.LEADER, ROLE.MANAGER];
      mockRequest.role = ROLE.PRESIDENT;

      let callback = isAccess(...roles);
      callback(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
    test('error: not allow', async () => {
      let roles = [ROLE.PRESIDENT, ROLE.LEADER, ROLE.MANAGER];
      mockRequest.role = ROLE.CUSTOMER;

      let callback = isAccess(...roles);
      callback(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'You do not have permission to access',
      });
    });
  });
});
