import createError from 'http-errors';
import { ValidationError } from 'sequelize';
import  sequelize  from '../config/database.mjs';


const {Product} = sequelize.models

export const getProduct = async (req, res, next) => {
  try {
    const queryFilter = req.query;
    let { p: page } = req.query;

    page = page ? ((page <= 0) ? 1 : page) : 1
    delete queryFilter.p

    // Customer trở lên được quyền vs product
    const products = await Product.findAndCountAll({ where: queryFilter, offset: (page - 1) * 10, limit: 10 });

    if (products.rows.length == 0) {
      return res.status(204).json({ message: 'Products not found' });
    }

    return res.status(200).json({ data: products });
  } catch (error) {
    next(error);
  }
};
export const addProduct = async (req, res, next) => {
  try {
    const username = req.username;
    const product = req.body;

    // Customer trở lên được quyền vs product
    const productInstance = await Product.create(
      Object.assign(product, {
        updateBy: username,
        createdBy: username,
      })
    );

    return res.status(200).json({ data: productInstance, message: 'Create product successfully' });
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(createError(400, error.message));
    }
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const username = req.username;
    const { id } = req.params;
    const product = req.body;

    // Customer trở lên được quyền vs product
    const queryFilter = { productCode: id };

    await Product.update(Object.assign(product, { updatedBy: username }), { where: queryFilter });

    return res.status(200).json({ message: 'Update product successfully' });
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(createError(400, error.message));
    }
    return next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Customer trở lên được quyền vs product
    const queryFilter = { productCode: id };

    const row = await Product.destroy({ where: queryFilter });

    return res.status(200).json({ message: `Delete ${row} product successfully` });
  } catch (error) {
    next(error);
  }
};
