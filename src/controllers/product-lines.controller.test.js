import createError from 'http-errors';
import { ValidationError } from 'sequelize';

import sequelize from '../../config/database.mjs';
import { mockProductLine, mockProductLinesQuery } from '../mocks/productLineData.mjs';
import { getProductLine, updateProductLine, deleteProductLine, addProductLine } from '../../controllers/product-lines.controller.mjs';

let mockRequest, mockResponse, mockNext;

const { ProductLine } = sequelize.models;

describe('ProductLine controller', () => {
    describe('get', () => {
        beforeEach(() => {
            mockRequest = {
                query: {
                    p: null
                }
            }
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            mockNext = jest.fn()

            ProductLine.findAndCountAll = jest.fn()
        })
        afterEach(() => {
            jest.clearAllMocks()
        })
        test('success: productlines with status 200', async () => {
            mockRequest.query.p = null
            mockProductLinesQuery.rows.push(mockProductLine);
            mockProductLinesQuery.count = mockProductLinesQuery.rows.length;
            
            ProductLine.findAndCountAll.mockResolvedValue(mockProductLinesQuery);

            let result = await getProductLine(mockRequest, mockResponse, mockNext);

            expect(result.status.mock.calls[0][0]).toEqual(200)
            expect(result.json.mock.calls[0][0]).toEqual({data: mockProductLinesQuery})
        })
        test('error: not found productlines', async () => {
            mockRequest.query.p = -1
            mockProductLinesQuery.rows = []
            mockProductLinesQuery.count = 0;

            ProductLine.findAndCountAll.mockResolvedValue(mockProductLinesQuery);

            let result = await getProductLine(mockRequest, mockResponse, mockNext);

            expect(result.status.mock.calls[0][0]).toEqual(204)
            expect(result.json.mock.calls[0][0]).toEqual({message: 'ProductLine not found'})
            
        })
        test('error: server fail', async () => {
            let error = new Error('Query Error')
            ProductLine.findAndCountAll.mockRejectedValue(error);

            await getProductLine(mockRequest, mockResponse, mockNext);

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

            ProductLine.create = jest.fn()
        })
        afterEach(() => {
            jest.clearAllMocks();
        })
        test('success: create success with status 201', async () => {
            mockRequest.body = mockProductLine;

            ProductLine.create.mockResolvedValue(mockProductLine);

            let result = await addProductLine(mockRequest, mockResponse, mockNext);

            expect(result.status.mock.calls[0][0]).toEqual(201);
            expect(result.json.mock.calls[0][0]).toEqual({data: mockProductLine});
        })

        test('error: create fail with status 400', async () => {
            mockRequest.body = mockProductLine;

            let error = new ValidationError('Invalid data')
            ProductLine.create.mockRejectedValue(error);

            await addProductLine(mockRequest, mockResponse, mockNext);

            expect(mockNext.mock.calls[0][0]).toEqual(createError(400, error.message));
        })

        test('error: server fail with status 500', async () => {
            mockRequest.body = mockProductLine;

            let error = new Error('Server error fail')
            ProductLine.create.mockRejectedValue(error);

            await addProductLine(mockRequest, mockResponse, mockNext);

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

            ProductLine.update = jest.fn()
        })
        afterEach(() => {
            jest.clearAllMocks();
        })
        test('success: return updated productlines with status 201', async() => {
            mockRequest.body = mockProductLine;

            // fake ket qua tra ve
            let rows = 1;
            ProductLine.update.mockResolvedValue(rows);

            let result = await updateProductLine(mockRequest, mockResponse, mockNext);

            expect(result.status.mock.calls[0][0]).toEqual(201);
            expect(result.json.mock.calls[0][0]).toEqual({message: `Update ${rows} row successfully`});
        })
        test('error: update body request fail with status 400', async () => {
            mockRequest.body = mockProductLine;

            let error = new ValidationError('Invalid Data')
            ProductLine.update.mockRejectedValue(error);

            await updateProductLine(mockRequest, mockResponse, mockNext);

            expect(mockNext.mock.calls[0][0]).toEqual(createError(400, error.message));
        })
        test('error: server fail with status 500', async () => {
            mockRequest.body = mockProductLine;

            let error = new Error('Server error fail')
            ProductLine.update.mockRejectedValue(error);

            await updateProductLine(mockRequest, mockResponse, mockNext);
            
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

            ProductLine.destroy = jest.fn()
            
        })
        afterEach(() => {
            jest.clearAllMocks();
        })
        test('success: status 200', async () => {
            // fake ket qua tra ve
            let rows = 1;
            ProductLine.destroy.mockResolvedValue(rows);

            let result = await deleteProductLine(mockRequest, mockResponse, mockNext);

            expect(result.status.mock.calls[0][0]).toEqual(200)
            expect(result.json.mock.calls[0][0]).toEqual({ message: `Delete successfully ${rows} row` })
        })
        test('error: server fail', async () => {
             // fake ket qua tra ve
             let error = new Error('Server error fail')
             ProductLine.destroy.mockRejectedValue(error)
 
             await deleteProductLine(mockRequest, mockResponse, mockNext);
 
             expect(mockNext.mock.calls[0][0]).toEqual(error)
        })

    })
})