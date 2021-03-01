import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel';
import {
  getPostData
} from '../utils';
import {
  FormatRequest
} from '../helpers/FormatUserRequest';
import checkToken from '../middlewares/checkToken';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  'Access-Control-Max-Age': 2592000, // 30 days
  'Content-Type': 'application/json',
  'Access-Control-Allow-Headers': 'X-Requested-With',
};

// @desc    user signup
// @route   POST /api/users
export const signup = async (req, res) => {
  try {
    const body = await getPostData(req);
    const values = FormatRequest(JSON.parse(body));
    const checkUser = await User.checkExistAccount(values.username);
    if (checkUser.rows.length) {
      res.writeHead(203, {
        'Content-Type': 'application/json',
      });
      return res.end(
        JSON.stringify({
          message: 'Sorry, this username already exists',
          errors: [
            {
              path: 'username',
            },
          ],
        })
      );
    }
    const user = await User.create([
      values.username,
      bcrypt.hashSync(values.password),
    ]);
    if (user.rows.length) {
      const {
        password, ...rest
      } = user.rows[0];
      const token = jwt.sign(
        {
          ...rest,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: 86400,
        }
      ); // expires in 24 hours
      res.writeHead(201, {
        'Content-Type': 'application/json',
      });
      return res.end(
        JSON.stringify({
          token,
          user: rest,
          message: 'successful created an account',
        })
      );
    }
  } catch (error) {
    res.writeHead(error.status);
    return res.end({
      message: error.message,
      errors: error.errors,
    });
  }
};

// @desc    signin
// @route   POST /api/users/login
export const signin = async (req, res) => {
  try {
    const body = await getPostData(req);
    const values = FormatRequest(JSON.parse(body));
    const {
      rows
    } = await User.checkExistAccount(values.username);
    if (rows.length > 0) {
      for (let i = 0; i < rows.length; i += 1) {
        if (bcrypt.compareSync(values.password, rows[i].password)) {
          const {
            password, ...rest
          } = rows[i];
          const token = jwt.sign(
            {
              id: rest.id,
              username: rest.username,
              password,
            },
            process.env.SECRET_KEY,
            {
              expiresIn: 86400,
            } // expires in 24 hours
          );
          res.writeHead(200, headers);
          return res.end(
            JSON.stringify({
              token,
              user: rest,
              message: 'successful login',
            })
          );
        }
      }
    }

    res.writeHead(401, {
      'Content-Type': 'application/json',
    });
    return res.end(
      JSON.stringify({
        error: 'Sorry, your username or password is incorrect',
      })
    );
  } catch (error) {
    res.writeHead(error.status, {
      'Content-Type': 'application/json',
    });
    return res.end(
      JSON.stringify({
        message: error.message,
        errors: error.errors,
      })
    );
  }
};

// GET All registered users
export const getAllUsers = async (req, res) => {
  const body = await getPostData(req);
  if (!(await checkToken(req, res))) {
    res.writeHead(401, {
      'Content-Type': 'application/json',
    });
    return res.end(
      JSON.stringify({
        message: 'Please, Authentication is required!',
      })
    );
  }

  try {
    const users = await User.findAll(req.user.username);
    if (users.rows.length > 0) {
      for (let i = 0; i < users.rows.length; i += 1) {
        delete users.rows[i].password;
        users.rows[i].createdAt = new Date(
          users.rows[i].createdAt
        ).toDateString();
      }
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify(users.rows));
    } else {
      res.writeHead(404, {
        'Content-Type': 'application/json',
      });
      res.end(
        JSON.stringify({
          error: 'user not found!',
        })
      );
    }
  } catch (error) {
    // console.log(error);
  }
};

const exp = {
  signup,
  signin,
  getAllUsers,
};

export default exp;
