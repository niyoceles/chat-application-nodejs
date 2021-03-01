import {
  formatError
} from '../helpers/FormatError';
import {
  FormatRequest
} from '../helpers/FormatUserRequest';
import checkToken from '../middlewares/checkToken';
import Message from '../models/messageModel';
import User from '../models/userModel';
import {
  getPostData
} from '../utils';

// @desc    Send message
// @route   POST /api/messages
export const sendMessage = async (req, res) => {
  try {
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
    const values = FormatRequest(JSON.parse(body), ['receiver', 'message']);
    const result = await User.findOne(values.receiver);
    if (!result.rows.length) {
      res.writeHead(404, {
        'Content-Type': 'application/json',
      });
      return res.end(
        JSON.stringify({
          error: 'receiver not found!',
        })
      );
    }
    const message = await Message.createMessage([
      req.user.username,
      values.receiver,
      values.message,
    ]);
    if (message.rows.length) {
      res.writeHead(201, {
        'Content-Type': 'application/json',
      });
      return res.end(JSON.stringify(message.rows[0]));
    }
  } catch (error) {
    const apiError = formatError(error);
    res.writeHead(apiError.code, {
      'Content-Type': 'application/json',
    });
    return res.end(JSON.stringify(apiError.body));
  }
};

// GET All my messages
export const getMyChats = async (req, res) => {
  try {
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
    const values = FormatRequest(JSON.parse(body), ['sender']);

    const messages = await Message.findMyChat(values.sender, req.user.username);
    if (messages.rows.length) {
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify(messages.rows));
    } else {
      res.writeHead(404, {
        'Content-Type': 'application/json',
      });
      res.end(
        JSON.stringify({
          error: 'You have no message!',
        })
      );
    }
  } catch (error) {
    const apiError = formatError(error);
    res.writeHead(apiError.code, {
      'Content-Type': 'application/json',
    });
    return res.end(JSON.stringify(apiError.body));
  }
};

const exportMessage = {
  sendMessage,
  getMyChats,
};

export default exportMessage;
