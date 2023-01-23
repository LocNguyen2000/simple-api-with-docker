import Logger from '../models/logger.mjs';

export const addLog = async (req, res, next) => {
  try {
    const { level, message } = req.body;

    let data = await Logger.create({ level, message, user: res.username });

    return res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
};

export const updateLog = async (req, res, next) => {
  try {
    const id = req.params, upData = req.body;

    let returnedData = await Logger.findOneAndUpdate(id, upData);

    return res.status(200).json({ data: Object.assign(returnedData, upData) });
  } catch (error) {
    next(error);
  }
};

export const getLog = async (req, res, next) => {
  try {
    const LIMIT = 10;
    let queryFilters = req.query,
      { p: page } = req.query,
      { startAt, endAt } = req.query;

    page = page ? (page <= 0 ? 1 : page) : 1;
    delete queryFilters.p

    if (startAt || endAt) {
      queryFilters['createdAt'] = {};

      if (startAt) {
        delete queryFilters.startAt;
        startAt = new Date(startAt).toISOString();
        queryFilters['createdAt']['$gte'] = startAt;
      }

      if (endAt) {
        delete queryFilters.endAt;
        endAt = new Date(endAt).toISOString();
        queryFilters['createdAt']['$lt'] = endAt;
      }
    }

    const count = await Logger.countDocuments(queryFilters);

    let data = await Logger.find(queryFilters)
      .limit(LIMIT)
      .skip((page - 1) * LIMIT);
    return res.status(200).json({
      data: {
        rows: data,
        count,
      },
    });
  } catch (error) {
    next(error);
  }
};
