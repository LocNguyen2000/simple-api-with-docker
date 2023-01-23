import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import { readFile } from 'fs/promises';

import * as scheduler from './utils/cron.mjs';
import config from './config/config.mjs';
import connectToDb from './config/connect.mjs';
import customerRouter from './routes/customer.route.mjs';
import employeeRouter from './routes/employee.route.mjs';
import loggerRouter from './routes/logger.route.mjs';
import officeRouter from './routes/offices.route.mjs';
import userRouter from './routes/auth.router.mjs';
import productRouter from './routes/product.route.mjs';
import sequelize from './config/database.mjs';
import orderRouter from './routes/order.route.mjs';
import logRouter from './routes/logger.route.mjs'
import productLineRouter from './routes/product-line.route.mjs'
import Logger from './models/logger.mjs';

const app = express();
const port = config.port || process.env.PORT;

connectToDb(sequelize, config.mongodb);

const swaggerDoc = JSON.parse(await readFile(new URL('./docs/swagger.json', import.meta.url)));

const options = {
  swaggerOptions: {
    explorer: true,
  },
};

// 3rd-party middleware
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc, options));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// application middleware
app.use('/users', userRouter);
app.use('/customers', customerRouter);
app.use('/employees', employeeRouter);
app.use('/offices', officeRouter);
app.use('/logger', loggerRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/logs', logRouter)
app.use('/product-lines', productLineRouter);


// Not found method
app.use((req, res, next) => {
  next(createError(404, 'Not found'));
});

// Error handling middleware
app.use(async (err, req, res, next) => {
  if (!err.status || err.status === 404) {
    await Logger.create({logLevel: 'Error', message: err.message, user: req.username || ''});
  } else {
    await Logger.create({logLevel: 'Warning', message: err.message, user: req.username || ''});
  }

  return res.status(err.status || 500).json({ status: err.status || 500, message: err.message });
});

app.listen(port, () => {
  console.log(`App connected successfully on port ${port}`);
});

// Task run every minute
scheduler.checkOrderStatus.start();
// scheduler.checkDefaultEmployee.start();