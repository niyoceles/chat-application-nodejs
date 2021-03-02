import db from '../config';

export const create = (values) => new Promise((resolve, reject) => {
  const inserData = `INSERT INTO
            users(username, password)
            VALUES($1, $2)
            returning id, username, password, "createdAt"`;

  resolve(db.query(inserData, values));
});

export const findAll = username => new Promise((resolve, reject) => {
  resolve(db.query('SELECT * FROM users WHERE username!=$1', [username]));
});

export const findOne = username => new Promise((resolve, reject) => {
  resolve(db.query('SELECT * FROM users WHERE username=$1', [username]));
});

const exportModels = { findAll, findOne, create };
export default exportModels;
