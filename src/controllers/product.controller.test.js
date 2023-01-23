import createError from 'http-errors';
import { ValidationError } from 'sequelize';
import sequelize from '../../config/database.mjs';
import { mockProduct, mockProductQuery } from '../mocks/productData.mjs';
import { getProduct, addProduct, updateProduct, deleteProduct } from '../../controllers/product.controller.mjs'
let mockRequest, mockResponse, mockNext;

const { Product} = sequelize.models;

describe('Product controller', () => {
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
            mockNext = jest.fn();
            Product.findAndCountAll = jest.fn();
        })
        afterEach(() => {
            jest.clearAllMocks();
        })
        test('success: get product', async () => {
            mockRequest.query.p = 1;
            
            mockProductQuery.rows.push(mockProduct);
            mockProductQuery.count = mockProductQuery.rows.length;

            Product.findAndCountAll.mockResolvedValue(mockProductQuery);

            let result = await getProduct(mockRequest, mockResponse, mockNext);
            
      expect(result.status.mock.calls[0][0]).toEqual(200);
      expect(result.json.mock.calls[0][0]).toEqual({ data: mockProductQuery });
        })
        test('errro: Products not found', async () => {
            mockProductQuery.rows = [];
            mockProductQuery.count = 0;

            
            Product.findAndCountAll.mockResolvedValue(mockProductQuery);

            let result = await getProduct(mockRequest, mockResponse, mockNext);
            expect(result.status.mock.calls[0][0]).toEqual(204);
            expect(result.json.mock.calls[0][0]).toEqual({ message: 'Products not found' });
        })
        test('error: server fail with status 500', async () => {
            mockRequest.query.p = 1;

            mockProductQuery.rows.push(mockProduct);
            mockProductQuery.count = mockProductQuery.rows.length;
            let error = new Error('Server error fail')
            Product.findAndCountAll.mockRejectedValue(error);

            await getProduct(mockRequest, mockResponse, mockNext);

            expect(mockNext.mock.calls[0][0]).toEqual(error);
        })
    })
    describe('post', () => {
        beforeEach(() => {
            mockRequest = {
                body: null,
                username: null
            }
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            mockNext = jest.fn();
            Product.create = jest.fn();
        })
        afterEach(() => {
            jest.clearAllMocks();
        })
        test('Create product successfully', async () => {
            mockRequest.body = mockProduct;
            mockRequest.username = 'test'

            Product.create.mockResolvedValue(mockProduct)

            let result = await addProduct(mockRequest, mockResponse, mockNext);
            expect(result.status.mock.calls[0][0]).toEqual(200);
            expect(result.json.mock.calls[0][0]).toEqual({ data: mockProduct,  message: 'Create product successfully' });
        })
        test('error: fail with status 400', async () => {
            mockRequest.body = mockProduct;
            mockRequest.username = 'test'

            let error = new ValidationError('Body request error')
            Product.create.mockRejectedValue(error)
            await addProduct(mockRequest, mockResponse, mockNext);
            expect(mockNext.mock.calls[0][0]).toEqual(createError(400, error));
        })
        test('error: server fail with status 500', async () => {
            mockRequest.body = mockProduct;
            mockRequest.username = 'test'

            let error = new Error('Server error fail')
            Product.create.mockRejectedValue(error)

            await addProduct(mockRequest, mockResponse, mockNext);

            expect(mockNext.mock.calls[0][0]).toEqual(error);
        })
    })
    describe('put', () => {
        beforeEach(() => {
            mockRequest = {
                body: null,
                username: null,
                params: {
                    id: null
                }
            }
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            mockNext = jest.fn();
            Product.update = jest.fn();
        })
        afterEach(() => {
            jest.clearAllMocks();
        })
        test('success: Update product successfully',async () => {
            mockRequest.username = 'test'
            mockRequest.body = mockProduct,
            mockRequest.params.id = 1

            let rowAffected = 1;
            Product.update.mockResolvedValue(rowAffected);

            let result = await updateProduct(mockRequest, mockResponse, mockNext);
      expect(result.status.mock.calls[0][0]).toEqual(200);
      expect(result.json.mock.calls[0][0]).toEqual({ message: 'Update product successfully'  });
        })
        test('error: fail with status 400', async () => {
            mockRequest.body = mockProduct;
            mockRequest.username = 'test'

            let error = new ValidationError('Body request error')
            Product.update.mockRejectedValue(error)
            await updateProduct(mockRequest, mockResponse, mockNext);
            expect(mockNext.mock.calls[0][0]).toEqual(createError(400, error));
        })
        test('error: server fail with status 500', async () => {
            mockRequest.body = mockProduct;
            mockRequest.username = 'test'

            let error = new Error('Server error fail')
            Product.update.mockRejectedValue(error)

            await updateProduct(mockRequest, mockResponse, mockNext);

            expect(mockNext.mock.calls[0][0]).toEqual(error);
        })
    })
    describe('delete', () => {
        beforeEach(() => {
            mockRequest = {
                params: {
                    id: null
                }
            }
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            mockNext = jest.fn();
            Product.destroy = jest.fn();
        })
        afterEach(() => {
            jest.clearAllMocks();
        })
        test('success: Delete product successfully', async () => {
            mockRequest.params.id = 1

            let rowAffected = 1;
            Product.destroy.mockResolvedValue(rowAffected);
            let result = await deleteProduct(mockRequest, mockResponse, mockNext);
            expect(result.status.mock.calls[0][0]).toEqual(200);
            expect(result.json.mock.calls[0][0]).toEqual({ message: `Delete ${rowAffected} product successfully` });
        })
        test('error: server fail with status 500', async () => {
            mockRequest.params.id = 1

            let error = new Error('Server error fail')
            Product.destroy.mockRejectedValue(error)

            await deleteProduct(mockRequest, mockResponse, mockNext);

            expect(mockNext.mock.calls[0][0]).toEqual(error);
        })
    })
})