import http from 'http';

const {
	createMessage,
	getMyChats,
} = require('./controllers/messageController');

import { signup, getAllUsers, signin } from './controllers/userController';
const { default: checkToken } = require('./middlewares/checkToken');

const server = http.createServer((req, res) => {
	// Set CORS headers
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
	res.setHeader('Access-Control-Allow-Headers', '*');

	if (req.url === '/api/users' && req.method === 'GET') {
		// checkToken(req, res);
		getAllUsers(req, res);
	} else if (req.url === '/api/users' && req.method === 'POST') {
		signup(req, res);
	} else if (req.url === '/api/users/login' && req.method === 'POST') {
		signin(req, res);
	} else if (req.url === '/api/messages' && req.method === 'POST') {
		// checkToken(req, res);
		createMessage(req, res);
	} else if (req.url === '/api/messages' && req.method === 'GET') {
		getMyChats(req, res);
	} else {
		res.writeHead(404, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ message: 'Route Not Found' }));
	}
});

const PORT = process.env.PORT || 9000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = server;
