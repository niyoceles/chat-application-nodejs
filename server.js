import http from 'http';
import {
  signup, getAllUsers, signin
} from './controllers/userController';

const {
  sendMessage, getMyChats
} = require('./controllers/messageController');

const server = http.createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  if (req.url === '/api/users' && req.method === 'GET') {
    await getAllUsers(req, res);
  } else if (req.url === '/api/users' && req.method === 'POST') {
    await signup(req, res);
  } else if (req.url === '/api/users/login' && req.method === 'POST') {
    await signin(req, res);
  } else if (req.url === '/api/message' && req.method === 'POST') {
    await sendMessage(req, res);
  } else if (req.url === '/api/messages' && req.method === 'POST') {
    await getMyChats(req, res);
  } else {
    res.writeHead(404, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({
      message: 'Route Not Found'
    }));
  }
});

const PORT = process.env.PORT || 9000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = server;
