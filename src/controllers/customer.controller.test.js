import createError from 'http-errors';
import { ValidationError } from 'sequelize';

import sequelize from '../../config/database.mjs';
import { ROLE } from '../../config/variables.mjs'
import { mockCustomersQuery, mockCustomer } from '../mocks/customerData.mjs'
import { getCustomer, addCustomer, updateCustomer, deleteCustomer } from '../../controllers/customer.controller.mjs';

let mockRequest, mockResponse, mockNext;

const { Customer } = sequelize.models;

describe('Customer controller', () => {
    describe('get', () => {
        beforeEach(() => {
            mockRequest = {
                role: null,
                employeeNumber: null,
                customerNumber: null,
                query: {
                    customerNumber: null,
                    p: 1
                }
            }
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            mockNext = jest.fn()

            Customer.findAndCountAll = jest.fn()
        })
        afterEach(() => {
            jest.clearAllMocks()
        })
        test('success: as president', async () => {
            mockRequest.query.p = -1;
            mockRequest.role = ROLE.PRESIDENT;
            mockRequest.employeeNumber = 1
            mockRequest.query.customerNumber = mockCustomer.customerNumber;
            
            // fake data query
            mockCustomersQuery.rows.push(mockCustomer);
            mockCustomersQuery.count = mockCustomersQuery.rows.length;

            Customer.findAndCountAll.mockResolvedValue(mockCustomersQuery)

            let result = await getCustomer(mockRequest, mockResponse, mockNext);

            expect(result.status.mock.calls[0][0]).toEqual(200);
            expect(result.json.mock.calls[0][0]).toEqual({ data: mockCustomersQuery });
        })
        test('error: found no customer as staff', async () => {
            mockRequest.role = ROLE.STAFF;
            mockRequest.employeeNumber = 1;
            mockRequest.query.customerNumber = mockCustomer.customerNumber;

            // fake data query
            mockCustomersQuery.rows = [];
            mockCustomersQuery.count = 0;

            Customer.findAndCountAll.mockResolvedValue(mockCustomersQuery)
            
            let result = await getCustomer(mockRequest, mockResponse, mockNext);
            
            expect(result.status.mock.calls[0][0]).toEqual(204)
            expect(result.json.mock.calls[0][0]).toEqual({ message: 'Customer not found' })
        })
        test('error: not exist as customer', async () => {
            mockRequest.role = ROLE.CUSTOMER;
            mockRequest.customerNumber = 1;

            let error = new Error('Server error fail')

            Customer.findAndCountAll.mockRejectedValue(error);

            await getCustomer(mockRequest, mockResponse, mockNext);

            expect(mockNext.mock.calls[0][0]).toEqual(error);
        })

    })
    describe('post', () => {
        beforeEach(() => {
            mockRequest = {
                body: null,
                username: 'tester'
            }
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            mockNext = jest.fn()

            Customer.create = jest.fn()
        })
        afterEach(() => {
            jest.clearAllMocks();
        })
        test('success: customers with status 201', async () => {
            mockRequest.body = mockCustomer;

            // fake dữ liệu trả về
            Customer.create.mockResolvedValue(mockCustomer);

            let result = await addCustomer(mockRequest, mockResponse, mockNext);

            expect(result.status.mock.calls[0][0]).toEqual(201);
            expect(result.json.mock.calls[0][0]).toEqual({data: mockCustomer});
        })

        test('error: body request with status 400', async () => {
            mockRequest.body = mockCustomer;

            // trả về lỗi
            let error = new ValidationError('Body request validate fail')
            Customer.create.mockRejectedValue(error);

            await addCustomer(mockRequest, mockResponse, mockNext);

            expect(mockNext.mock.calls[0][0]).toEqual(createError(400, error));
        })
        test('error: server fail with status 500', async () => {
            mockRequest.body = mockCustomer;

            // trả về lỗi
            let error = new Error('Server error fail')
            Customer.create.mockRejectedValue(error);

            await addCustomer(mockRequest, mockResponse, mockNext);

            expect(mockNext.mock.calls[0][0]).toEqual(error);
        })
    })
    describe('put', () => {
        beforeEach(() => {
            mockRequest = {
                body: null,
                username: 'tester',
                params: {
                    id: 1
                }
            }
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            mockNext = jest.fn()

            Customer.update = jest.fn()
        })
        afterEach(() => {
            jest.clearAllMocks();
        })
        test('success: status 200 as any', async () => {
            mockRequest.body = mockCustomer;

            // fake ket qua tra ve
            let rowAffected = 1;
            Customer.update.mockResolvedValue(rowAffected);

            let result = await updateCustomer(mockRequest, mockResponse, mockNext);

            expect(result.status.mock.calls[0][0]).toEqual(200);
            expect(result.json.mock.calls[0][0]).toEqual({message: `Update successfully ${rowAffected} row`});
        })
        test('success: with status 200 as customer', async () => {
            mockRequest.body = mockCustomer;
            mockRequest.role = ROLE.CUSTOMER;
            mockRequest.customerNumber = mockRequest.params.id;

            // fake ket qua tra ve
            let rowAffected = 1;
            Customer.update.mockResolvedValue(rowAffected);

            let result = await updateCustomer(mockRequest, mockResponse, mockNext);

            expect(result.status.mock.calls[0][0]).toEqual(200);
            expect(result.json.mock.calls[0][0]).toEqual({message: `Update successfully ${rowAffected} row`});
        })
        test('error: update other profile as customer & status 401', async () => {
            mockRequest.body = mockCustomer;
            mockRequest.role = ROLE.CUSTOMER;
            mockRequest.customerNumber = 2;

            await updateCustomer(mockRequest, mockResponse, mockNext);

            expect(mockNext.mock.calls[0][0]).toEqual(createError(401, 'Customer cannot change others data'));
        })

        test('error: update body request fail with status 400', async () => {
            mockRequest.body = mockCustomer;
            mockRequest.customerNumber = 2;

            let error = new ValidationError('Body request validate fail')
            Customer.update.mockRejectedValue(error);

            await updateCustomer(mockRequest, mockResponse, mockNext);

            expect(mockNext.mock.calls[0][0]).toEqual(createError(400, error));
        })

        test('error: server fail with status 500', async () => {
            mockRequest.body = mockCustomer;
            mockRequest.customerNumber = 2;

            let error = new Error('Server error fail')
            Customer.update.mockRejectedValue(error);

            await updateCustomer(mockRequest, mockResponse, mockNext);
            
            expect(mockNext.mock.calls[0][0]).toEqual(error);
        })
    })
    describe('delete', () => {
        beforeEach(() => {
            mockRequest = {
                params: {
                    id: 1
                }
            }
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            mockNext = jest.fn()

            Customer.destroy = jest.fn()
        })
        afterEach(() => {
            jest.clearAllMocks();
        })
        test('success: status 200', async () => {
            // fake ket qua tra ve
            let rowAffected = 1;
            Customer.destroy.mockResolvedValue(rowAffected);

            let result = await deleteCustomer(mockRequest, mockResponse, mockNext);

            expect(result.status.mock.calls[0][0]).toEqual(200)
            expect(result.json.mock.calls[0][0]).toEqual({ message: `Delete successfully ${rowAffected} row` })
        })
        test('error: server fail', async () => {
             // fake ket qua tra ve
             let error = new Error('Server error fail')
             Customer.destroy.mockRejectedValue(error);
 
             await deleteCustomer(mockRequest, mockResponse, mockNext);
 
             expect(mockNext.mock.calls[0][0]).toEqual(error)
        })

    })
})