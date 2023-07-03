import http from 'http';
import dotenv from 'dotenv';
import { validate } from 'uuid';
import { userController } from './controllers/user.controller.js';

dotenv.config();
const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
	const controller = userController();

	if (req.url === '/api/users' && req.method === 'GET') {
		const users = await controller.allUsers();
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(users));
	} else if (req.url === '/api/users' && req.method === 'POST') {
		let body = '';
		req.on('data', (chunk) => {
			body += chunk.toString();
		});
		req.on('end', () => {
			try {
				const requestBody = JSON.parse(body);
				const {username, age, hobbies} = requestBody;
				const newUser = controller.createNewUser(username, age, hobbies);
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(JSON.stringify(newUser));
			} catch (error) {
				res.writeHead(400, {'Content-Type': 'application/json'});
				res.end({error: 'Invalid request body'});
			}
		});
	} else if (req.url.match(/\/api\/users\/([0-9 A-Z]+)/i) && req.method === 'GET') {
		const userId = req.url.split('/')[3];
		if (!validate(userId)) {
			res.writeHead(400, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({error: 'userId invalid'}));
		} else {
			const user = await controller.getUserById(userId);
			if (user) {
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(JSON.stringify(user));
			} else {
				res.writeHead(404, {'Content-Type': 'application/json'});
				res.end(JSON.stringify({error: 'User not found'}));
			}
		}
	} else if (req.url.match(/\/api\/users\/([0-9 A-Z]+)/i) && req.method === 'PUT') {
		const userId = req.url.split('/')[3];
		if (!validate(userId)) {
			res.writeHead(400, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({error: 'userId invalid'}));
		} else {
			const user = await controller.getUserById(userId);
			if (user) {
				let body = '';
				req.on('data', (chunk) => {
					body += chunk.toString();
				});
				req.on('end', () => {
					try {
						const requestBody = JSON.parse(body);
						const updatedUser = controller.updateUser(userId, requestBody);
						res.writeHead(200, {'Content-Type': 'application/json'});
						res.end(JSON.stringify({message: updatedUser}));
					} catch (error) {
						res.writeHead(400, {'Content-Type': 'application/json'});
						console.log(error);
						res.end({error: 'Invalid request body'});
					}
				});
			} else {
				res.writeHead(404, {'Content-Type': 'application/json'});
				res.end(JSON.stringify({error: 'User not found'}));
			}
		}
	} else if (req.url.match(/\/api\/users\/([0-9 A-Z]+)/i) && req.method === 'DELETE') {
		const userId = req.url.split('/')[3];
		if (!validate(userId)) {
			res.writeHead(400, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({error: 'invalid userId'}));
		} else {
			const user = controller.getUserById(userId);
			if (user) {
				await controller.deleteUser(userId);
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(JSON.stringify({message: 'User deleted'}));
			} else {
				res.writeHead(404, {'Content-Type': 'application/json'});
				res.end(JSON.stringify({error: 'User not found'}));
			}
		}
	} else {
		res.writeHead(404, {'Content-Type': 'application/json'});
		res.end(JSON.stringify({error: 'Requested URL not found'}));
	}
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});

export default server;
