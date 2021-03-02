import { formatError } from '../helpers/FormatError';
import { FormatRequest } from '../helpers/FormatUserRequest';
import checkToken from '../middlewares/checkToken';
import Message from '../models/messageModel';
import User from '../models/userModel';
import { getPostData } from '../utils';

// @desc    Send message
// @route   POST /api/messages
export const sendMessage = async (req, res) => {
  try {
    const body = await getPostData(req);
    if (!(await checkToken(req, res))) throw new Error("not authenticated");
    const values = FormatRequest(JSON.parse(body), ['receiver', 'message']);
    const result = await User.findOne(values.receiver);
    if (!result.rows.length) throw new Error("receiver not found");
    if (values.receiver === req.user.username) throw new Error("no sent message to yourself")
    const message = await Message.createMessage([req.user.username, values.receiver, values.message,]);
    res.writeHead(201, { 'Content-Type': 'application/json', });
    return res.end(JSON.stringify(message.rows[0]));
  } catch (error) {
    const apiError = formatError(error);
    res.writeHead(apiError.code, { 'Content-Type': 'application/json', });
    return res.end(JSON.stringify(apiError.body));
  }
};

// GET All my messages
export const getMyChats = async (req, res) => {
  try {
    const body = await getPostData(req);
    if (!(await checkToken(req, res))) throw new Error("not authenticated")
    const values = FormatRequest(JSON.parse(body), ['sender']);
    const result = await User.findOne(values.sender);
    if (!result.rows.length) throw new Error("receiver not found");

    const messages = await Message.findMyChat(values.sender, req.user.username);
    if (!messages.rows.length) throw new Error("no messages found");
    res.writeHead(200, { 'Content-Type': 'application/json', });
    res.end(JSON.stringify(messages.rows));
  } catch (error) {
    const apiError = formatError(error);
    res.writeHead(apiError.code, { 'Content-Type': 'application/json', });
    return res.end(JSON.stringify(apiError.body));
  }
};

const exportMessage = { sendMessage, getMyChats };

export default exportMessage;
