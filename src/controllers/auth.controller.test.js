import { SECRET_KEY } from '../tests/env/env.mjs';
import config from '../config/config.mjs';

import createError from 'http-errors';

import sequelize from '../config/database.mjs';
import { TIME_TO_LIVE } from '../config/variables.mjs';
import { mockUser } from '../tests/mocks/userData.mjs';
import { mockEmployee } from '../tests/mocks/employeeData.mjs';
import { login, register } from './auth.controller.mjs';
import { encryptPassword } from '../utils/security.mjs';
let mockRequest, mockResponse, mockNext;

const { User, Employee, Customer } = sequelize.models;

describe('Auth controller', () => {
  beforeAll(() => {
    config.secretKey = SECRET_KEY;
  });
  describe('Login', () => {
    beforeEach(() => {
      mockRequest = {
        body: {
          username: null,
          password: null,
        },
      };
      mockResponse = {
        cookie: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      mockNext = jest.fn();
      User.findOne = jest.fn();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('success login', async () => {
      mockRequest.body.username = 'president';
      mockRequest.body.password = '123';
      mockUser.password = await encryptPassword(mockUser.password);
      User.findOne.mockResolvedValue(mockUser);

      let result = await login(mockRequest, mockResponse, mockNext);

      expect(result.cookie.mock.calls[0][0]).toEqual('access_token');
      expect(result.cookie.mock.calls[0][2]).toMatchObject({ maxAge: TIME_TO_LIVE * 1000, httpOnly: true });
      expect(result.status.mock.calls[0][0]).toEqual(200);
      expect(result.json.mock.calls[0][0]).toMatchObject({ success: true, message: 'Login successful' });
      // expect(mockNext).toHaveBeenCalled()
    });
    test('error: not found user', async () => {
      mockRequest.body.username = 'president';
      mockRequest.body.password = '123';

      mockUser.password = await encryptPassword(mockUser.password);

      User.findOne.mockResolvedValue(null);
      let error = createError(400, 'Username or Password is invalid');
      await login(mockRequest, mockResponse, mockNext);

      expect(mockNext.mock.calls[0][0]).toEqual(error);
    });
    test('error: password does not match', async () => {
      mockRequest.body.username = 'president';
      mockRequest.body.password = '1234';

      mockUser.password = await encryptPassword(mockUser.password);

      User.findOne.mockResolvedValue(mockUser);
      let error = createError(400, 'Username or Password is invalid');
      await login(mockRequest, mockResponse, mockNext);

      expect(mockNext.mock.calls[0][0]).toEqual(error);
    });
    test('error: Server error fail', async () => {
      mockRequest.body.username = mockUser.username;
      mockRequest.body.password = '1234';
      let error = new Error('Server error fail');
      User.findOne.mockRejectedValue(error);

      await login(mockRequest, mockResponse, mockNext);
      expect(mockNext.mock.calls[0][0]).toEqual(error);
    });
  });
  describe('Register', () => {
    beforeEach(() => {
      mockRequest = {
        body: {
          username: null,
          password: null,
          customerNumber: null,
          employeeNumber: null,
          isEmployee: null,
        },
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      mockNext = jest.fn();
      User.findAll = jest.fn();
      User.create = jest.fn();
      Employee.findByPk = jest.fn();
      Customer.findByPk = jest.fn();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('success register', async () => {
      mockRequest.body = {
        username: mockUser.username,
        password: mockUser.password,
        customerNumber: mockUser.customerNumber,
        employeeNumber: mockUser.employeeNumber,
        isEmployee: mockUser.isEmployee,
      };
      User.findAll.mockResolvedValue([]);
      Employee.findByPk.mockResolvedValue(mockEmployee);
      User.create.mockResolvedValue(mockUser);

      let result = await register(mockRequest, mockResponse, mockNext);

      expect(result.status.mock.calls[0][0]).toEqual(200);
      expect(result.json.mock.calls[0][0]).toEqual({ message: 'Register successfully', data: mockUser });
    });
    test('error: req.body is empty', async () => {
      let result = await register(mockRequest, mockResponse, mockNext);
      expect(result.status.mock.calls[0][0]).toEqual(400);
      expect(result.json.mock.calls[0][0]).toEqual({ message: 'not be empty' });
    });
    test('error: Username or userId already used', async () => {
      mockRequest.body = {
        username: mockUser.username,
        password: mockUser.password,
        customerNumber: mockUser.customerNumber,
        employeeNumber: mockUser.employeeNumber,
        isEmployee: mockUser.isEmployee,
      };
      User.findAll.mockResolvedValue([mockUser]);
      let result = await register(mockRequest, mockResponse, mockNext);
      expect(result.status.mock.calls[0][0]).toEqual(400);
      expect(result.json.mock.calls[0][0]).toEqual({ message: 'this username or userId already used' });
    });
    test('error: customer or employee does not exist', async () => {
      mockRequest.body = {
        username: mockUser.username,
        password: mockUser.password,
        customerNumber: 123,
        employeeNumber: null,
        isEmployee: false,
      };
      User.findAll.mockResolvedValue([]);
      Customer.findByPk.mockResolvedValue(null);

      let result = await register(mockRequest, mockResponse, mockNext);
      expect(result.status.mock.calls[0][0]).toEqual(400);
      expect(result.json.mock.calls[0][0]).toEqual({ message: 'this customer or employee does not exist' });
    });
    test('error: Server error fail', async () => {
      mockRequest.body = {
        username: mockUser.username,
        password: mockUser.password,
        customerNumber: mockUser.customerNumber,
        employeeNumber: mockUser.employeeNumber,
        isEmployee: mockUser.isEmployee,
      };

      let error = new Error('Server error fail');
      User.findAll.mockRejectedValue(error);

      await register(mockRequest, mockResponse, mockNext);
      expect(mockNext.mock.calls[0][0]).toEqual(error);
    });
  });
});
