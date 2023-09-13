import jwt from 'jsonwebtoken';
import config from '../config/config.mjs';
export function verifyToken(req, res, next) {
  const token = req.cookies['access_token'];
  const apiKey = req.headers['x-api-key'];

  if (apiKey === config.apiKey) {
    req.username = 'admin';
    return next();
  }

  if (!token) {
    return res.status(400).json({ success: false, message: 'Please Login' });
  } else {
    try {
      const { data } = jwt.verify(token, config.secretKey);

      req.username = data.username;
      req.employeeNumber = data.employeeNumber;
      req.customerNumber = data.customerNumber;
      req.role = data.role;
      req.officeCode = data.officeCode;
      return next();
    } catch (error) {
      return next(error);
    }
  }
}

export function isAccess(...roles) {
  return (req, res, next) => {
    if (req.headers['x-api-key'] === config.apiKey) {
      req.username = 'admin';
      return next();
    }

    if (!roles.includes(req.role)) {
      return res.status(401).json({
        success: false,
        message: 'You do not have permission to access',
      });
    }
    return next();
  };
}
