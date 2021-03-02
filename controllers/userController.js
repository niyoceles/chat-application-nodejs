import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel';
import { getPostData } from '../utils';
import { FormatRequest } from '../helpers/FormatUserRequest';
import checkToken from '../middlewares/checkToken';
import { formatError } from '../helpers/FormatError';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  'Access-Control-Max-Age': 2592000, // 30 days
  'Content-Type': 'application/json',
  'Access-Control-Allow-Headers': 'X-Requested-With',
};

// @desc    user signup
// @route   POST /api/users
export const signup = async (request, response) => {
  try {
    const body = await getPostData(request);
    const values = FormatRequest(JSON.parse(body));
    const user = await User.create([values.username, bcrypt.hashSync(values.password),]);
    const { password, ...rest } = user.rows[0];
    const token = jwt.sign({ ...rest, }, process.env.SECRET_KEY, { expiresIn: 86400, }); // expires in 24 hours
    response.writeHead(201, { 'Content-Type': 'application/json', });
    return response.end(JSON.stringify({ token, user: rest, message: 'successful created an account', }));
  } catch (error) {
    const apiError = formatError(error);
    response.writeHead(apiError.code, { 'Content-Type': 'application/json', });
    return response.end(JSON.stringify(apiError.body));
  }
};

// @desc    signin
// @route   POST /api/users/login
export const signin = async (req, res) => {
  try {
    const body = await getPostData(req);
    const values = FormatRequest(JSON.parse(body), ["username", "password"], [], true);
    const { rows } = await User.findOne(values.username);
    if (!rows.length) throw new Error("user not found");
    if (!bcrypt.compareSync(values.password, rows[0].password)) throw new Error("password not match");
    const { password, ...rest } = rows[0];
    const token = jwt.sign(
      { id: rest.id, username: rest.username, password, },
      process.env.SECRET_KEY, { expiresIn: 86400, } // expires in 24 hour
    );
    res.writeHead(200, headers);
    return res.end(JSON.stringify({ token, user: rest, message: 'successful login', }));
  } catch (error) {
    const apiError = formatError(error);
    res.writeHead(apiError.code, { 'Content-Type': 'application/json', });
    return res.end(JSON.stringify(apiError.body));
  }
};

// GET All registered users
export const getAllUsers = async (req, res) => {
  try {
    if (!(await checkToken(req, res))) throw new Error("not authenticated");
    const { rows } = await User.findAll(req.user.username);
    if (!rows.length) throw new Error('user not found')
    const result = await Promise.all(rows.map((user) => {
      const { password, ...restInfo } = user;
      return { ...restInfo, createdAt: new Date(restInfo.createdAt).toDateString() }
    }));
    res.writeHead(200, { 'Content-Type': 'application/json', });
    res.end(JSON.stringify(result));
  } catch (error) {
    const apiError = formatError(error);
    res.writeHead(apiError.code, { 'Content-Type': 'application/json', });
    return res.end(JSON.stringify(apiError.body));
  }
};

const exportUser = { signup, signin, getAllUsers, };
export default exportUser;
