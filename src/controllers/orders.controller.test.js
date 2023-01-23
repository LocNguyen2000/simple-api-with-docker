
import createError from 'http-errors';
import { Op, ValidationError } from 'sequelize';
import { addOrder, getOrder, updateOrder, deleteOrder } from '../../controllers/orders.controller.mjs'
import sequelize from '../../config/database.mjs';
import { mockCustomer } from '../mocks/customerData.mjs';
import { mockOrderQuery, mockOrderRequest } from '../mocks/orderData.mjs';
import { ORDER_STATUS, ROLE } from '../../config/variables.mjs';
import { mockProduct } from '../mocks/productData.mjs';


let mockRequest, mockResponse, mockNext, mockTransaction;

const { Order, OrderDetail, Payment, Customer, Product } = sequelize.models;

describe('Order controller', () => {
  describe('get', () => {
    beforeEach(() => {
      mockRequest = {
        query: {
          p: null,
          customerNumber: null
        },
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      mockNext = jest.fn();

      Order.findAndCountAll = jest.fn()
      Customer.findAll = jest.fn()
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('success: get order as customer', async () => {
      mockRequest.query.p = 1;
      mockRequest.query.customerNumber = mockCustomer.customerNumber;
      mockRequest.customerNumber = mockCustomer.customerNumber;
      mockRequest.role = ROLE.CUSTOMER;

      Order.findAndCountAll.mockResolvedValue([mockOrderQuery]);

      let result = await getOrder(mockRequest, mockResponse, mockNext);

      expect(result.status.mock.calls[0][0]).toEqual(200);
      expect(result.json.mock.calls[0][0]).toEqual({ data: [mockOrderQuery] });
    });
    test('error: get other customer order error', async () => {
      mockRequest.query.p = -1;
      mockRequest.query.customerNumber = mockCustomer.customerNumber + 1;
      mockRequest.customerNumber = mockCustomer.customerNumber;
      mockRequest.role = ROLE.CUSTOMER;

      await getOrder(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(createError(401, 'Customer can only check their own order'));
    })
    test('success: get own customers as staff', async () => {
      mockRequest.query.p = null;
      mockRequest.query.customerNumber = mockCustomer.customerNumber;
      mockRequest.employeeNumber = mockCustomer.salesRepEmployeeNumber;
      mockRequest.role = ROLE.STAFF;

      Customer.findAll.mockResolvedValue([
        { customerNumber: mockCustomer.customerNumber },
        { customerNumber: mockCustomer.customerNumber + 1 }
      ]);
      Order.findAndCountAll.mockResolvedValue([mockOrderQuery]);

      let result = await getOrder(mockRequest, mockResponse, mockNext);

      let expectedQuery = Object.assign(mockRequest.query, {
        customerNumber: { [Op.or]: [mockCustomer.customerNumber] }
      })

      expect(Customer.findAll).toHaveBeenCalled();
      expect(Order.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: expectedQuery })
      )
      expect(result.status.mock.calls[0][0]).toEqual(200);
      expect(result.json.mock.calls[0][0]).toEqual({ data: [mockOrderQuery] });
    });
    test('success: get no related own customer as staff', async () => {
      mockRequest.query.p = null;
      mockRequest.role = ROLE.STAFF;

      Customer.findAll.mockResolvedValue([]);

      let result = await getOrder(mockRequest, mockResponse, mockNext);

      expect(result.status.mock.calls[0][0]).toEqual(204);
      expect(result.json.mock.calls[0][0]).toEqual({ message: `You have no related customer's orders to check` });
    });
    test('error: check others staff customer as staff', async () => {
      mockRequest.query.p = null;
      mockRequest.query.customerNumber = mockCustomer.customerNumber;
      mockRequest.employeeNumber = mockCustomer.salesRepEmployeeNumber;
      mockRequest.role = ROLE.STAFF;

      Customer.findAll.mockResolvedValue([
        { customerNumber: mockCustomer.customerNumber + 1 },
        { customerNumber: mockCustomer.customerNumber + 2 }
      ]);

      await getOrder(mockRequest, mockResponse, mockNext);

      let expectedError = createError(401, 'Staff can only check their own customers orders')
      expect(mockNext).toHaveBeenCalledWith(expectedError);
    });
    test('error: Server error fail', async () => {
      mockRequest.role = ROLE.PRESIDENT;

      let error = new Error('Server error fail');
      Order.findAndCountAll.mockRejectedValue(error);

      await getOrder(mockRequest, mockResponse, mockNext);

      expect(mockNext.mock.calls[0][0]).toEqual(error);
    });
  });
  describe('post', () => {
    let mockOrderResponse = []

    beforeEach(() => {
      mockRequest = {
        body: null,
        username: 'tester',
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      mockNext = jest.fn();

      mockTransaction = {
        commit: jest.fn().mockResolvedValue(),
        rollback: jest.fn().mockResolvedValue(),
      };
      mockOrderResponse = []

      sequelize.transaction = jest.fn().mockResolvedValue(mockTransaction);

      Order.findOrCreate = jest.fn()
      Order.findAll = jest.fn()
      Customer.findByPk = jest.fn()
      Payment.create = jest.fn()
      Order.create = jest.fn()
      OrderDetail.bulkCreate = jest.fn()
      Product.findAll = jest.fn()
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('success: Create normal order', async () => {
      mockRequest.body = mockOrderRequest;
      mockOrderQuery.status = ORDER_STATUS.IN_PROCESS;
      mockOrderResponse.push(mockOrderQuery, true)

      Order.findOrCreate.mockResolvedValue(mockOrderResponse);
      Customer.findByPk.mockResolvedValue(mockCustomer);
      Payment.create.mockResolvedValue(mockOrderRequest.payment);

      Order.findAll.mockResolvedValue([mockOrderQuery])

      let fakeProducts = new Array(mockOrderRequest.details.length)
      Product.findAll.mockResolvedValue(fakeProducts)
      OrderDetail.bulkCreate.mockResolvedValue(mockOrderRequest.details)

      let result = await addOrder(mockRequest, mockResponse, mockNext);

      expect(result.status.mock.calls[0][0]).toEqual(201);
      expect(result.json.mock.calls[0][0]).toEqual({
        message: 'Create order successfully',
        order: mockOrderQuery,
        details: mockOrderRequest.details,
        payment: mockOrderRequest.payment,
      });
    });

    test('success: Create COD order with total payment lower than customer limit', async () => {
      mockRequest.body = mockOrderRequest;
      mockOrderQuery.status = ORDER_STATUS.COD;
      mockOrderResponse.push(mockOrderQuery, true)

      Order.findOrCreate.mockResolvedValue(mockOrderResponse);
      Customer.findByPk.mockResolvedValue(mockCustomer);
      Payment.create.mockResolvedValue(mockOrderRequest.payment);

      // tạo order với payment < customer credit limit
      mockOrderQuery.OrderDetails.map(detail => {
        detail.TotalDetailPayment = 0
        return detail;
      })

      Order.findAll.mockResolvedValue([mockOrderQuery])

      // PASS COD CHECK
      let fakeProducts = new Array(mockOrderRequest.details.length)
      Product.findAll.mockResolvedValue(fakeProducts)
      OrderDetail.bulkCreate.mockResolvedValue(mockOrderRequest.details)

      let result = await addOrder(mockRequest, mockResponse, mockNext);

      expect(result.status.mock.calls[0][0]).toEqual(201);
      expect(result.json.mock.calls[0][0]).toEqual({
        message: 'Create order successfully',
        order: mockOrderQuery,
        details: mockOrderRequest.details,
        payment: mockOrderRequest.payment,
      });
    });

    test('error: Create COD order with total payment higher than customer limit', async () => {
      mockRequest.body = mockOrderRequest;
      mockOrderQuery.status = ORDER_STATUS.COD;
      mockOrderResponse.push(mockOrderQuery, true)

      Order.findOrCreate.mockResolvedValue(mockOrderResponse);
      Customer.findByPk.mockResolvedValue(mockCustomer);
      Payment.create.mockResolvedValue(mockOrderRequest.payment);

      // tạo order với payment > customer credit limit
      mockOrderQuery.OrderDetails.map(detail => {
        detail.TotalDetailPayment = mockCustomer.creditLimit
        return detail;
      })

      Order.findAll.mockResolvedValue([mockOrderQuery])

      await addOrder(mockRequest, mockResponse, mockNext);

      let error = new ValidationError('Customer total payment are higher than creditLimit')
      expect(mockNext).toHaveBeenCalledWith(createError(400, error.message));
    });
    test('error: Create order with detail not exist in products', async () => {
      mockRequest.body = mockOrderRequest;
      mockOrderQuery.status = ORDER_STATUS.COD;
      mockOrderResponse.push(mockOrderQuery, true)

      Order.findOrCreate.mockResolvedValue(mockOrderResponse);
      Customer.findByPk.mockResolvedValue(mockCustomer);
      Payment.create.mockResolvedValue(mockOrderRequest.payment);

      // tạo order với payment > customer credit limit
      mockOrderQuery.OrderDetails.map(detail => {
        detail.TotalDetailPayment = 0;
        return detail;
      })

      Order.findAll.mockResolvedValue([mockOrderQuery])
      // PASS COD CHECK
      let noProducts = []
      Product.findAll.mockResolvedValue(noProducts)

      await addOrder(mockRequest, mockResponse, mockNext);

      let error = new ValidationError('Some products does not exist')
      expect(mockNext).toHaveBeenCalledWith(createError(400, error.message));
    });
    test('error: request details is not an array', async () => {
      mockRequest.body = {
        order: mockOrderRequest.order,
        payment: mockOrderRequest.payment,
        details: {}
      };

      await addOrder(mockRequest, mockResponse, mockNext);

      let error = new ValidationError('Order detail list must be an array')
      expect(mockNext).toHaveBeenCalledWith(createError(400, error.message));
    });

    test('error: Exist record with this order number', async () => {
      mockRequest.body = mockOrderRequest;
      mockOrderResponse.push({}, false)

      Order.findOrCreate.mockResolvedValue(mockOrderResponse);

      await addOrder(mockRequest, mockResponse, mockNext);

      let error = new ValidationError('This order number already exist')
      expect(mockNext).toHaveBeenCalledWith(createError(400, error.message));
    });

    test('error: Order status flow error', async () => {
      mockRequest.body = mockOrderRequest;
      mockOrderQuery.status = ORDER_STATUS.DISPUTED;
      mockOrderResponse.push(mockOrderQuery, true)

      Order.findOrCreate.mockResolvedValue(mockOrderResponse);

      await addOrder(mockRequest, mockResponse, mockNext);

      let error = new ValidationError('New order status must be In-Process or COD')
      expect(mockNext).toHaveBeenCalledWith(createError(400, error.message));
    });

    test('error: Customer not exist in this order number', async () => {
      mockRequest.body = mockOrderRequest;
      mockOrderQuery.status = ORDER_STATUS.IN_PROCESS;
      mockOrderResponse.push(mockOrderQuery, true)

      Order.findOrCreate.mockResolvedValue(mockOrderResponse);
      Customer.findByPk.mockResolvedValue(null);

      await addOrder(mockRequest, mockResponse, mockNext);

      let error = new Error('This customer does not exist')
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
  describe('put', () => {
    beforeEach(() => {
      mockRequest = {
        username: 'tester',
        body: null,
        params: {
          id: 1,
        },
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      mockNext = jest.fn();
      mockTransaction = {
        commit: jest.fn().mockResolvedValue(),
        rollback: jest.fn().mockResolvedValue(),
      };

      sequelize.transaction = jest.fn().mockResolvedValue(mockTransaction);

      Order.findByPk = jest.fn()
      Order.update = jest.fn()
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('success: Update successfully as president', async () => {
      mockRequest.body = {
        comments: mockOrderQuery.comments,
        status: ORDER_STATUS.DISPUTED
      }
      mockOrderQuery.status = ORDER_STATUS.IN_PROCESS

      let rowAffected = 1;

      Order.findByPk.mockResolvedValue(mockOrderQuery)
      Order.update.mockResolvedValue(rowAffected);

      let result = await updateOrder(mockRequest, mockResponse, mockNext);

      expect(mockTransaction.commit).toHaveBeenCalled()
      expect(result.status).toHaveBeenCalledWith(200)
      expect(result.json).toHaveBeenCalledWith({ message: `Update ${rowAffected} order successfully` })

    });
    test('error: Request body - status field not found', async () => {
      mockRequest.body = {
        comments: mockOrderQuery.comments,
        status: null
      }

      await updateOrder(mockRequest, mockResponse, mockNext);
      
      let error = new ValidationError('Request body must have status field')
      
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(createError(400, error.message));
    });

    test('error: Order - not found', async () => {
      mockRequest.body = {
        comments: mockOrderQuery.comments,
        status: mockOrderQuery.status
      }
      
      Order.findByPk.mockResolvedValue(null)
      
      await updateOrder(mockRequest, mockResponse, mockNext);
      
      let error = new ValidationError('Order not found')

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(createError(400, error.message));
    });
    test('error: Order - status flow invalid - DISPUTED > INPROCESS', async () => {
      mockRequest.body = {
        comments: mockOrderQuery.comments,
        status: ORDER_STATUS.IN_PROCESS
      }
      mockOrderQuery.status = ORDER_STATUS.DISPUTED

      Order.findByPk.mockResolvedValue(mockOrderQuery)

      await updateOrder(mockRequest, mockResponse, mockNext);

      let error = new ValidationError(`Cannot update order from status ${ORDER_STATUS.DISPUTED} to ${ORDER_STATUS.IN_PROCESS}`)

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(createError(400, error.message));
    });
    test('error: Order - status flow invalid - SHIPPED > ONHOLD', async () => {
      mockRequest.body = {
        comments: mockOrderQuery.comments,
        status: ORDER_STATUS.ON_HOLD
      }
      mockOrderQuery.status = ORDER_STATUS.SHIPPED

      Order.findByPk.mockResolvedValue(mockOrderQuery)

      await updateOrder(mockRequest, mockResponse, mockNext);

      let error = new ValidationError(`Cannot update order from status ${ORDER_STATUS.SHIPPED} to ${ORDER_STATUS.ON_HOLD}`)

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(createError(400, error.message));
    });
    test('error: Order - status flow invalid - RESOLVED > DISPUTED', async () => {
      mockRequest.body = {
        comments: mockOrderQuery.comments,
        status: ORDER_STATUS.DISPUTED
      }
      mockOrderQuery.status = ORDER_STATUS.RESOLVED

      Order.findByPk.mockResolvedValue(mockOrderQuery)

      await updateOrder(mockRequest, mockResponse, mockNext);

      let error = new ValidationError(`Cannot update order from status ${ORDER_STATUS.RESOLVED} to ${ORDER_STATUS.DISPUTED}`)

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(createError(400, error.message));
    });
    test('error: Order - status flow invalid - SHIPPED > RESOLVED', async () => {
      mockRequest.body = {
        comments: mockOrderQuery.comments,
        status: ORDER_STATUS.RESOLVED
      }
      mockOrderQuery.status = ORDER_STATUS.SHIPPED

      Order.findByPk.mockResolvedValue(mockOrderQuery)

      await updateOrder(mockRequest, mockResponse, mockNext);

      let error = new ValidationError(`Cannot update order from status ${ORDER_STATUS.SHIPPED} to ${ORDER_STATUS.RESOLVED}`)

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(createError(400, error.message));
    });
    
    test('error: Server error fail', async () => {
      mockRequest.body = {
        comments: mockOrderQuery.comments,
        status: mockOrderQuery.status
      }

      let error = new Error('Server error fail');
      
      Order.findByPk.mockRejectedValue(error)

      await updateOrder(mockRequest, mockResponse, mockNext);

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockNext.mock.calls[0][0]).toEqual(error);
    });
    test('error: create fail with status 400', async () => {
    });
  });
  describe('delete', () => {
    beforeEach(() => {
      mockRequest = {
        username: 'tester',
        query: {
          comments: null,
        },
        params: {
          id: null,
        },
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      mockNext = jest.fn();

      mockTransaction = {
        commit: jest.fn().mockResolvedValue(),
        rollback: jest.fn().mockResolvedValue(),
      };
      sequelize.transaction = jest.fn().mockResolvedValue(mockTransaction);

      Order.findByPk = jest.fn()
      Order.update = jest.fn()
      Payment.destroy = jest.fn()
      Order.destroy = jest.fn()
      OrderDetail.destroy = jest.fn()

    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('success: Delete successfully', async () => {
      mockRequest.query.comments = "Change order status to cancelled"
      mockOrderQuery.status = ORDER_STATUS.IN_PROCESS;
      mockOrderQuery.toJSON = jest.fn().mockReturnValue(mockOrderQuery)
      let rowAffected = 1;

      Order.findByPk.mockResolvedValue(mockOrderQuery);
      Order.update.mockResolvedValue()
      Payment.destroy.mockResolvedValue(rowAffected);
      Order.destroy.mockResolvedValue(rowAffected);
      OrderDetail.destroy.mockResolvedValue(rowAffected);

      let result = await deleteOrder(mockRequest, mockResponse, mockNext);

      expect(result.status.mock.calls[0][0]).toEqual(200)
      expect(result.json.mock.calls[0][0]).toEqual({ message: `Delete ${rowAffected} order, ${rowAffected} payment, ${rowAffected} details successfully` })
    });
    test('success: Delete successfully (no update comments)', async () => {
      mockRequest.query.comments = null
      mockOrderQuery.status = ORDER_STATUS.IN_PROCESS;
      mockOrderQuery.toJSON = jest.fn().mockReturnValue(mockOrderQuery)
      let rowAffected = 1;

      Order.findByPk.mockResolvedValue(mockOrderQuery);
      Order.update.mockResolvedValue()
      Payment.destroy.mockResolvedValue(rowAffected);
      Order.destroy.mockResolvedValue(rowAffected);
      OrderDetail.destroy.mockResolvedValue(rowAffected);

      let result = await deleteOrder(mockRequest, mockResponse, mockNext);

      expect(result.status.mock.calls[0][0]).toEqual(200)
      expect(result.json.mock.calls[0][0]).toEqual({ message: `Delete ${rowAffected} order, ${rowAffected} payment, ${rowAffected} details successfully` })
    });
    
    test('error: Order not found', async () => {
      mockOrderQuery.status = ORDER_STATUS.IN_PROCESS;
      mockOrderQuery.comments = "Change order status to cancelled";

      Order.findByPk.mockResolvedValue(null);
      let error = createError(400, 'Order not found')

      await deleteOrder(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error)
    });
    test('error: Order not found', async () => {
      mockOrderQuery.status = ORDER_STATUS.DISPUTED;
      mockOrderQuery.comments = "Change order status to disputed";

      Order.findByPk.mockResolvedValue(mockOrderQuery);

      await deleteOrder(mockRequest, mockResponse, mockNext);

      let error = createError(400, 'Cannot delete in current order status')
      expect(mockNext).toHaveBeenCalledWith(error)
    });
    test('error: Server error fail', async () => {
      let error = new Error('Server error fail')

      Order.findByPk.mockRejectedValue(error);

      await deleteOrder(mockRequest, mockResponse, mockNext)

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockNext.mock.calls[0][0]).toEqual(error);
    });
  });
});


