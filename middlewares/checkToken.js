import jwt from 'jsonwebtoken';

const checkToken = async (req, res) => {
  // console.log("header token===", req.headers.authorization)
  if (req.headers.authorization === undefined) return false;

  // @split the provided token
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return false;

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decodedToken;
    return true;
  } catch (error) {
    return false;
  }
};

export default checkToken;
