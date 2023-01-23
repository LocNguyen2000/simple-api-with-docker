import createError from 'http-errors';
import { ValidationError } from 'sequelize';
import sequelize from '../config/database.mjs';
import { ROLE } from '../config/variables.mjs';

const { Customer } = sequelize.models;

export const getCustomer = async (req, res, next) => {
  try {
    let queryFilter = req.query;
    let { p: page } = req.query;

    page = page ? ((page <= 0) ? 1 : page) : 1
    delete queryFilter.p

    if (req.role == ROLE.STAFF) {
      // Staff chỉ được xem khách hàng của họ
      queryFilter = Object.assign(queryFilter, { salesRepEmployeeNumber: req.employeeNumber });
    } else if (req.role == ROLE.CUSTOMER) {
      // Chỉ được xem thông tin của họ
      queryFilter = Object.assign(queryFilter, { customerNumber: req.customerNumber });
    }

    // Leader, Manager, President trở lên được xem mọi dữ liệu khách hàng
    let customers = await Customer.findAndCountAll({
      where: queryFilter,
      offset: (page - 1) * 10,
      limit: 10,
    });

    if (customers.rows.length == 0) {
      return res.status(204).json({ message: 'Customer not found' });
    }

    return res.status(200).json({ data: customers });
  } catch (error) {
    return next(error);
  }
};

export const addCustomer = async (req, res, next) => {
  try {
    const customerRequest = req.body;
    const username = req.username;

    // Staff trở lên được tạo mọi dữ liệu khách hàng
    let [customerInstance, created] = await Customer.findOrCreate(
      Object.assign(customerRequest, {
        updatedBy: username,
        createdBy: username,
      })
    )

    if (!created) {
      throw new ValidationError('Employee already exist')
    }

    return res.status(201).json({ data: customer });
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(createError(400, error.message));
    }
    return next(error);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const username = req.username;
    let customerRequest = req.body;

    if (req.role === ROLE.CUSTOMER) {
      // Customer chỉ được sửa dữ liệu bản thân
      if (req.customerNumber != id) {
        return next(createError(401, 'Customer cannot change others data'));
      }
    }
    // Staff trở lên được update mọi dữ liệu khách hàng
    let customerInstance = await Customer.findByPk(id, { raw: true });

    if (!customerInstance) {
      return next(createError(400, 'Customer does not exist'));
    }

    customerRequest.updatedBy = username;

    customerInstance = Object.assign(
      customerInstance,
      customerRequest
    )

    let queryObj = { customerNumber: id };
    let rowAffected = await Customer.update(customerInstance, { where: queryObj });

    return res.status(200).json({ message: `Update successfully ${rowAffected} row` });
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(createError(400, error.message));
    }
    return next(error);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Staff trở lên được xóa mọi dữ liệu khách hàng
    let queryObj = { customerNumber: id };
    let rowAffected = await Customer.destroy({ where: queryObj });

    return res.status(200).json({ message: `Delete successfully ${rowAffected} row` });
  } catch (error) {
    return next(error);
  }
};
