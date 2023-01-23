import createError from 'http-errors';
import { Op, ValidationError } from 'sequelize';

import sequelize from "../config/database.mjs";
import { ORDER_STATUS, ROLE } from "../config/variables.mjs";

const { Order, Payment, Product, Customer, OrderDetail } = sequelize.models;

export const getOrder = async (req, res, next) => {
    try {
        let queryFilter = req.query;
        let { p: page } = req.query;

        page = page ? ((page <= 0) ? 1 : page) : 1
        delete queryFilter.p

        // role = customer > chỉ check được order của bản thân
        if (req.role == ROLE.CUSTOMER) {
            if (queryFilter.customerNumber && queryFilter.customerNumber != req.customerNumber) {
                return next(createError(401, 'Customer can only check their own order'))
            }

            queryFilter = Object.assign(queryFilter, {
                customerNumber: req.customerNumber
            })
        }
        // role = staff > xem được order của customer của họ
        else if (req.role == ROLE.STAFF) {
            let staffCustomerNumbers = await Customer.findAll({ where: { salesRepEmployeeNumber: req.employeeNumber }, attributes: ['customerNumber'], raw: true });
            if (staffCustomerNumbers.length == 0) {
                return res.status(204).json({ message: `You have no related customer's orders to check` })
            }

            staffCustomerNumbers = staffCustomerNumbers.map(customer => {
                return customer.customerNumber;
            })

            if (queryFilter.customerNumber) {
                if (!staffCustomerNumbers.includes(parseInt(queryFilter.customerNumber))) {
                    return next(createError(401, 'Staff can only check their own customers orders'))
                }

                staffCustomerNumbers = [queryFilter.customerNumber];
            }

            queryFilter = Object.assign(queryFilter, {
                customerNumber: { [Op.or]: staffCustomerNumbers }
            })
        }
        // role = leader, manager, president > xem mọi
        let orders = await Order.findAndCountAll({ where: queryFilter, offset: (page - 1) * 10, limit: 10, include: { model: OrderDetail } });

        return res.status(200).json({ data: orders })
    } catch (error) {
        next(error);
    }
};
export const addOrder = async (req, res, next) => {
    const username = req.username
    let { order, details, payment } = req.body;

    var t = await sequelize.transaction();

    try {
         // Request - check details
         if (!(details instanceof Array)) {
            throw new ValidationError('Order detail list must be an array')
        }

        // Order
        order = Object.assign(order, {
            orderDate: new Date().toDateString(),
            updatedBy: username,
            createdBy: username,
        })
        
        // Order - CHECK ORDER NUMBER ĐÃ TỒN TẠI (gồm cả soft delete)
        let [orderInstance, created] = await Order.findOrCreate({ 
            where: { orderNumber: order.orderNumber }, 
            defaults: order, 
            paranoid: false, 
            raw: true,
            transaction: t
        })
        // Order - nếu model tìm thấy tồn tại order này > instance chưa được tạo > created = false
        if (!created) {
            throw new ValidationError('This order number already exist')
        }

        // Order - STATUS FLOW ERROR
        if (orderInstance.status != ORDER_STATUS.IN_PROCESS && orderInstance.status != ORDER_STATUS.COD) {
            throw new ValidationError('New order status must be In-Process or COD')
        }

        // Order - Find if customer exist > get credit limit and customer number
        let customerInstance = await Customer.findByPk(orderInstance.customerNumber, { attributes: ['customerNumber', 'creditLimit'], transaction: t });
        if (!customerInstance) {
            throw new Error('This customer does not exist')
        }

        // Payment
        payment = Object.assign(payment, {
            checkNumber: orderInstance.orderNumber,
            customerNumber: customerInstance.customerNumber,
            paymentDate: new Date().toDateString(),
            updatedBy: username,
            createdBy: username,
        })

        let paymentInstance = await Payment.create(payment, { transaction: t });

        // Payment - check if COD > check payment amount customer > credit limit > reject order
        if (orderInstance.status == ORDER_STATUS.COD) {
            let queryFilter = { customerNumber: customerInstance.customerNumber, status: { [Op.not]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED] } }

            // Find orders status != (CANCELLED & SHIPPED) 
            let orderWithDetails = await Order.findAll({
                raw: true, where: queryFilter, include: [{
                    model: OrderDetail, required: true, attributes:
                        [
                            'quantityOrdered',
                            'priceEach',
                            [sequelize.literal('(quantityOrdered * priceEach)'), "TotalDetailPayment"],
                        ]
                }], transaction: t
            })

            // calculate total payment
            let totalPayment = 0;
            for (let order of orderWithDetails) {
                let payment = order.OrderDetails.reduce((prevValue, currentValue) => {
                    prevValue = currentValue.TotalDetailPayment + prevValue;

                    return prevValue;
                }, 0)

                totalPayment += payment;
            }

            // check payment amount customer > credit limit
            if (totalPayment > customerInstance.creditLimit) {
                throw new ValidationError('Customer total payment are higher than creditLimit')
            }
        }

        // Details
        // Details - Check detail có đủ số sản phẩm tồn tại ko 
        let productCodes = details.map(prd => {
            return prd.productCode
        })
        let productsInDb = await Product.findAll({ where: { productCode: { [Op.in]: productCodes } }, transaction: t })

        if (productCodes.length != productsInDb.length) {
            throw new ValidationError('Some products does not exist')
        }

        // Details - Tạo mới
        let createdDetails = [];
        for (let detail of details) {
            detail = Object.assign(detail, {
                orderNumber: orderInstance.orderNumber,
                updatedBy: username,
                createdBy: username,
            })

            createdDetails.push(detail);
        }

        let detailInstances = await OrderDetail.bulkCreate(createdDetails, { transaction: t, validate : true, });

        await t.commit();

        return res.status(201).json({
            message: 'Create order successfully',
            order: orderInstance,
            details: detailInstances,
            payment: paymentInstance,
        })
    } catch (error) {
        await t.rollback();

        if (error instanceof ValidationError) {
            return next(createError(400, error.message));
        }
        return next(error);
    }
};
export const updateOrder = async (req, res, next) => {
    const username = req.username;
    const { id } = req.params;
    let { comments, status } = req.body;

    var t = await sequelize.transaction();

    try {
        if (!status) {
            throw new ValidationError('Request body must have status field')
        }

        let orderInstance = await Order.findByPk(id, { transaction: t, raw: true });

        if (!orderInstance) {
            throw new ValidationError('Order not found')
        }

        if ((orderInstance.status != ORDER_STATUS.IN_PROCESS || (status != ORDER_STATUS.DISPUTED &&
            status != ORDER_STATUS.SHIPPED &&
            status != ORDER_STATUS.ON_HOLD))
            && ((orderInstance.status != ORDER_STATUS.ON_HOLD) || (status != ORDER_STATUS.SHIPPED))
            && ((orderInstance.status != ORDER_STATUS.DISPUTED) || (status != ORDER_STATUS.RESOLVED))
            && ((orderInstance.status != ORDER_STATUS.RESOLVED) || (status != ORDER_STATUS.SHIPPED))
        ) {
            throw new ValidationError(`Cannot update order from status ${orderInstance.status} to ${status}`)
        }

        orderInstance = Object.assign(orderInstance, {
            status,
            updatedBy: username
        })
        orderInstance.shippedDate = status == ORDER_STATUS.SHIPPED ? new Date().toDateString() : orderInstance.shippedDate;
        orderInstance.comments = comments ? comments : orderInstance.comments;

        let rowAffected = await Order.update(orderInstance, { where: { orderNumber: orderInstance.orderNumber, }, transaction: t })

        await t.commit()
        return res.status(200).json({ message: `Update ${rowAffected} order successfully` })

    } catch (error) {
        await t.rollback();

        if (error instanceof ValidationError) {
            return next(createError(400, error.message));
        }
        return next(error);
    }
};
export const deleteOrder = async (req, res, next) => {
    const username = req.username;
    const { id } = req.params;
    const { comments } = req.query;

    var t = await sequelize.transaction();

    try {
        // find order and order details
        let orderInstance = await Order.findByPk(id, { include: { model: OrderDetail }, transaction: t, raw: true });

        if (!orderInstance) {
            return next(createError(400, 'Order not found'))
        }

        // check status RESOLVE - ONHOLD - INPROCESS > được xóa
        if ((orderInstance.status != ORDER_STATUS.RESOLVED) && (orderInstance.status != ORDER_STATUS.ON_HOLD) && (orderInstance.status != ORDER_STATUS.IN_PROCESS)) {
            return next(createError(400, 'Cannot delete in current order status'))
        }

        // // find payment of order
        let queryFilter = { checkNumber: orderInstance.orderNumber, customerNumber: orderInstance.customerNumber }

        let paymentRowAffected = await Payment.destroy({ where: queryFilter, transaction: t });

        orderInstance = Object.assign(orderInstance, {
            updatedBy: username,
            status: ORDER_STATUS.CANCELLED,
        })
        orderInstance.comments = comments ? comments : orderInstance.comments;

        await Order.update(orderInstance, { where: { orderNumber: orderInstance.orderNumber }, transaction: t })

        let orderRowAffected = await Order.destroy({ where: { orderNumber: orderInstance.orderNumber }, transaction: t })
        let detailRowsAffected = await OrderDetail.destroy({ where: { orderNumber: orderInstance.orderNumber }, transaction: t })
        await t.commit();

        return res.status(200).json({ message: `Delete ${orderRowAffected} order, ${paymentRowAffected} payment, ${detailRowsAffected} details successfully` })
    } catch (error) {
        await t.rollback()
        next(error);
    }
};
