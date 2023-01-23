import createError from 'http-errors';
import { ValidationError } from 'sequelize';
import  sequelize  from '../config/database.mjs';

const {Office, Employee} = sequelize.models

export const getOffice = async (req, res, next) => {
  try {
    let queryFilter = req.query;
    let { p: page } = req.query;

    page = page ? ((page <= 0) ? 1 : page) : 1
    delete queryFilter.p

    let offices = await Office.findAndCountAll({ where: queryFilter, offset: (page - 1) * 10, limit: 10 });

    if (offices.rows.length == 0) {
      return res.status(204).json({ message: 'Office not found' });
    }
    return res.status(200).json({ data: offices });
  } catch (error) {
    next(error);
  }
};

export const addOffice = async (req, res, next) => {
    const username = req.username;
    let office = req.body;

    office = Object.assign(office, {
      createdBy: username,
      updatedBy: username,
    });

    const t = await sequelize.transaction();
    try {
      let officeInstance = await Office.create(office, { transaction: t });

      await Employee.create(
        {
          lastName: '9999',
          firstName: '9999',
          createdBy: username,
          updatedBy: username,
          role: 4,
          jobTitle: 'Staff',
          officeCode: officeInstance.officeCode,
          email: '9999@mail.com',
          extension: '9999',
          employeeNumber: +officeInstance.officeCode + 9999,
          reportsTo: null
        },
        { transaction: t }
      );

      await t.commit();

      return res.status(201).json({ data: officeInstance });
  } catch (error) {
    await t.rollback();

    if (error instanceof ValidationError) {
      return next(createError(400, error.message));
    }
    return next(error);
  }
};

export const updateOffice = async (req, res, next) => {
  try {
    const username = req.username,
      { id } = req.params,
      office = req.body;

    let rowAffected = await Office.update(Object.assign(office, { updatedBy: username }), {
      where: {
        officeCode: id,
      },
    });

    return res.status(200).json({  message: `Update successfully ${rowAffected} row` });
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(createError(400, error.message));
    }
    next(error);
  }
};

export const deleteOffice = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check employees in office
    let employeeInOffice = await Employee.findAll({where: {officeCode: id}});
    
    if (employeeInOffice.length > 0){
      return next(createError(400, 'Cannot delete office that contains employees'))
    }

    let rowAffected = await Office.destroy({ where: { officeCode: id }});

    return res.status(200).json({  message: `Delete successfully ${rowAffected} row` });
  } catch (error) {
    next(error);
  }
};
