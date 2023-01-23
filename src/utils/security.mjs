import jwt from 'jsonwebtoken';
import config from '../config/config.mjs';
import bcrypt from 'bcrypt';
import { TIME_TO_LIVE } from '../config/variables.mjs';

export const jwtGenerate = (userInfo) => {
  const payload = {
    data: userInfo,
  };
  return jwt.sign(payload, config.secretKey, { expiresIn: TIME_TO_LIVE });
};

export const comparePassword = async (loginPass, userPassword) => {
  const isPassword = await bcrypt.compare(loginPass, userPassword);

  return isPassword;
};

export const encryptPassword = async (password) => {
  // generate salt for bcrypt randomness
  const saltRound = 10;
  const salt = await bcrypt.genSalt(saltRound);

  // encrypt pass with bcrypt
  const encrypted = await bcrypt.hash(password, salt);

  return encrypted;
};
