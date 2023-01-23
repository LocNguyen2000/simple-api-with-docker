import createError from 'http-errors';
import { ValidationError } from 'sequelize';
import { ROLE } from '../config/variables.mjs';
import sequelize from '../config/database.mjs';

const { Customer, Employee } = sequelize.models

export const getEmployee = async (req, res, next) => {
  try {
    const id = req.employeeNumber,
      role = req.role,
      officeCode = req.officeCode;

    let queryFilter = req.query;
    let { p: page } = req.query;

    page = page ? ((page <= 0) ? 1 : page) : 1
    delete queryFilter.p

    if (role === ROLE.LEADER) {
      queryFilter = Object.assign(queryFilter, { reportsTo: id });
    } else if (role === ROLE.MANAGER) {
      queryFilter = Object.assign(queryFilter, { officeCode });
    }

    let employeeList = await Employee.findAndCountAll({
      where: queryFilter,
      offset: (page - 1) * 10,
      limit: 10,
  });

    if (employeeList.rows.length == 0) {
      return res.status(204).json({ message: 'Employee not found' });
    }

    return res.status(200).json({ data: employeeList });
  } catch (error) {
    next(error);
  }
};

export const addEmployee = async (req, res, next) => {
  try {
    let employee = req.body,
      username = req.username;

    let [employeeInstance, created] = await Employee.findOrCreate(
      Object.assign(employee, {
        updatedBy: username,
        createdBy: username,
      }))

    if (!created){
      throw new ValidationError('Employee already exist')
    }

    return res.status(201).json({ data: employeeInstance, message: 'Create employee successfully' });
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(createError(400, error.message));
    }
    return next(error);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const role = req.role,
      officeCode = req.officeCode,
      username = req.username,
      { id } = req.params;

    let employee = req.body;

    let queryFilter = Object.assign({}, { employeeNumber: id });

    if (role === ROLE.MANAGER) {
      queryFilter = Object.assign(queryFilter, { officeCode });
    }

    employee = Object.assign(employee, {
      updatedBy: username,
    });

    let rowAffected = await Employee.update(employee, { where: queryFilter });

    return res.status(200).json({ message: `Update successfully ${rowAffected} record` });
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(createError(400, error.message));
    }
    next(error);
  }
};

export const deleteEmployee = async (req, res, next) => {
  const officeCode = req.officeCode;
  const { id } = req.params;

  // add transaction
  const t = await sequelize.transaction();

  try {
    // find default employee in officeCode
    const defaultEmployee = await Employee.findOne({
      where: { lastName: '9999', officeCode: officeCode },
      transaction: t,
    });

    // Find all customer from deleted employee
    const currentCustomers = await Customer.findAll({
      where: { salesRepEmployeeNumber: id },
      transaction: t,
    });

    // change current employee's customer > default employee's customer
    for (const customer of currentCustomers) {
      await customer.update({
        salesRepEmployeeNumber: defaultEmployee.employeeNumber,
        transaction: t,
      });
    }

    // delete employeee successfully
    let rowAffected = await Employee.destroy({ where: { employeeNumber: id }, transaction: t });

    await t.commit();


    return res.status(200).json({ message: `Delete successfully ${rowAffected} record` });
  } catch (error) {
    await t.rollback();

    next(error);
  }
};
