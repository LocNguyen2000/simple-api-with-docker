import createError from 'http-errors';
import { ValidationError } from 'sequelize';

import sequelize from '../../config/database.mjs';
import { mockOffice, mockOfficeQuery } from '../mocks/officeData.mjs';
import { mockEmployee } from '../mocks/employeeData.mjs';
import { getOffice, addOffice, updateOffice, deleteOffice } from '../../controllers/offices.controller.mjs';

let mockRequest, mockResponse, mockNext, mockTransaction;

const { Office, Employee } = sequelize.models;

describe('Office controller', () => {
    describe('get', () => {
        beforeEach(() => {
            mockRequest = {
                employeeNumber: null,
                query: {
                    p: null
                }
            }
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            mockNext = jest.fn()

            Office.findAndCountAll = jest.fn()
        })
        afterEach(() => {
            jest.clearAllMocks()
        })
        test('success: offices with status 200', async () => {
            mockOfficeQuery.rows.push(mockOffice);
            mockOfficeQuery.count = mockOfficeQuery.rows.length;

            Office.findAndCountAll.mockResolvedValue(mockOfficeQuery);

            let result = await getOffice(mockRequest, mockResponse, mockNext);

            expect(result.status.mock.calls[0][0]).toEqual(200)
            expect(result.json.mock.calls[0][0]).toEqual({data: mockOfficeQuery})
        })
        test('error: not found office', async () => {
            mockRequest.query.p = -1

            mockOfficeQuery.rows = []
            mockOfficeQuery.count = 0;

            Office.findAndCountAll.mockResolvedValue(mockOfficeQuery);

            let result = await getOffice(mockRequest, mockResponse, mockNext);

            expect(result.status.mock.calls[0][0]).toEqual(204)
            expect(result.json.mock.calls[0][0]).toEqual({message: 'Office not found'})
            
        })
        test('error: server fail', async () => {
            let error = new Error('Server error fail')
            Office.findAndCountAll.mockRejectedValue(error);

            await getOffice(mockRequest, mockResponse, mockNext);

            expect(mockNext.mock.calls[0][0]).toEqual(error)
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

            mockTransaction = {
                commit: jest.fn(),
                rollback: jest.fn()
            };

            sequelize.transaction = jest.fn().mockResolvedValue(mockTransaction);
            Office.create = jest.fn()
            Employee.create = jest.fn()
        })
        afterEach(() => {
            jest.clearAllMocks();
        })
        test('success: create success with status 201', async () => {
            mockRequest.body = mockEmployee;

            Office.create.mockResolvedValue(mockOffice);
            Employee.create.mockResolvedValue();
            mockTransaction.commit.mockResolvedValue();
            mockTransaction.rollback.mockResolvedValue();

            let result = await addOffice(mockRequest, mockResponse, mockNext);

            expect(mockTransaction.commit).toHaveBeenCalled();
            expect(result.status.mock.calls[0][0]).toEqual(201);
            expect(result.json.mock.calls[0][0]).toEqual({data: mockOffice});
        })

        test('error: create fail with status 400', async () => {
            mockRequest.body = mockEmployee;

            let error = new ValidationError('Body request error')
            Office.create.mockRejectedValue(error);
            mockTransaction.rollback.mockResolvedValue();

            await addOffice(mockRequest, mockResponse, mockNext);

            expect(mockTransaction.rollback).toHaveBeenCalled();
            expect(mockNext.mock.calls[0][0]).toEqual(createError(400, error));
        })

        test('error: server fail with status 500', async () => {
            mockRequest.body = mockEmployee;

            let error = new Error('Server error fail')
            Office.create.mockRejectedValue(error);
            mockTransaction.rollback.mockResolvedValue();

            await addOffice(mockRequest, mockResponse, mockNext);

            expect(mockTransaction.rollback).toHaveBeenCalled();
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

            Office.update = jest.fn()
        })
        afterEach(() => {
            jest.clearAllMocks();
        })
        test('success: return updated office with status 200', async() => {
            mockRequest.body = mockOffice;

            // fake ket qua tra ve
            let rowAffected = 1;
            Office.update.mockResolvedValue(rowAffected);

            let result = await updateOffice(mockRequest, mockResponse, mockNext);

            expect(result.status.mock.calls[0][0]).toEqual(200);
            expect(result.json.mock.calls[0][0]).toEqual({message: `Update successfully ${rowAffected} row`});
        })
        test('error: update body request fail with status 400', async () => {
            mockRequest.body = mockOffice;

            let error = new ValidationError('Body request validate fail')
            Office.update.mockRejectedValue(error);

            await updateOffice(mockRequest, mockResponse, mockNext);

            expect(mockNext.mock.calls[0][0]).toEqual(createError(400, error));
        })
        test('error: server fail with status 500', async () => {
            mockRequest.body = mockOffice;

            let error = new Error('Server error fail')
            Office.update.mockRejectedValue(error);

            await updateOffice(mockRequest, mockResponse, mockNext);
            
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

            Office.destroy = jest.fn()
            Employee.findAll = jest.fn()
        })
        afterEach(() => {
            jest.clearAllMocks();
        })
        test('success: status 200', async () => {
            // fake ket qua tra ve
            let rowAffected = 1;
            Office.destroy.mockResolvedValue(rowAffected);
            Employee.findAll.mockResolvedValue([])

            let result = await deleteOffice(mockRequest, mockResponse, mockNext);

            expect(result.status.mock.calls[0][0]).toEqual(200)
            expect(result.json.mock.calls[0][0]).toEqual({ message: `Delete successfully ${rowAffected} row` })
        })
        test('error: status 400 - delete office with employees', async () => {
            // fake ket qua tra ve
            Employee.findAll.mockResolvedValue([mockEmployee])

            await deleteOffice(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(createError(400, 'Cannot delete office that contains employees'))
        })
        test('error: server fail', async () => {
             // fake ket qua tra ve
             let error = new Error('Server error fail')
             Employee.findAll.mockRejectedValue(error)
 
             await deleteOffice(mockRequest, mockResponse, mockNext);
 
             expect(mockNext.mock.calls[0][0]).toEqual(error)
        })

    })
})