import express from 'express';
import mysql from 'mysql2';
import jsonwebtoken from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

// Create a connection to the database
const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
});

// Connect to the database
connection.connect((err) => {
	if (err) {
		console.error(err);
		return;
	}
	console.log('Connected to the database');
});

const app = express();
app.use(cookieParser());

// http://localhost:3000/api/users/'%20OR%20'1'='1
// SQL Injection Vulnerability Endpoint
app.get('/api/users/:username', (req, res) => {
	const username = req.params.username;
	connection.query(
		'SELECT username FROM users WHERE username = ?',
		[username],
		(err, results) => {
			if (err) {
				console.error(err);
				res.sendStatus(500);
				return;
			}
			console.log(results);
			res.send(results);
		}
	);
});

// Ex. localhost:3000/api/login
// http://localhost:3000/api/login/?username=jimmyNeutron05&password=brainblast
// http://localhost:3000/api/login/?username=admin&password=admin
// Authentication Bypass Endpoint
app.get('/api/login', (req, res) => {
	const username = req.query.username;
	const password = req.query.password;

	if (!username || !password) {
		res.status(400).json({ message: 'Username and password are required' });
		return;
	}

	const adminUser = process.env.ADMIN_USERNAME;
	const adminPass = process.env.ADMIN_PASSWORD;

	if (username === adminUser && password === adminPass) {
		const token = jsonwebtoken.sign(
			{ username, isAdmin: true },
			process.env.ADMIN_SECRET,
			{ expiresIn: '1h' }
		);

		res.cookie('login', token, { httpOnly: true });
		res.json({ message: 'Login successful' });
		return;
	}

	connection.query(
		'SELECT * FROM users WHERE username = ? AND password = ?',
		[username, password],
		(err, results) => {
			if (err) {
				console.error('Error executing the query');
				res.sendStatus(500);
				return;
			}

			if (results.length === 0) {
				res.status(404).json({ message: 'Invalid username or password' });
				return;
			}

			const token = jsonwebtoken.sign({ username }, process.env.COOKIE_SECRET, {
				expiresIn: '1h',
			});

			res.cookie('login', token, { httpOnly: true });
			res.json({ message: 'Login successful' });
		}
	);
});

// Ex. localhost:3000/api/documents/1
// IDOR Vulnerability Endpoint
// It allows users to access documents that they are not authorized to view.
app.get('/api/documents/:id', (req, res) => {
	let verified = false;
	try {
		verified = jsonwebtoken.verify(
			req.cookies.login,
			process.env.COOKIE_SECRET
		);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
		return;
	}

	if (!verified) {
		res.sendStatus(403);
		return;
	}

	const id = req.params.id;
	connection.query(
		'SELECT * FROM documents WHERE id = ?',
		[id],
		(err, results) => {
			if (err) {
				console.error('Error executing the query');
				res.sendStatus(500);
				return;
			}
			res.send(results);
		}
	);
});

// Ex. localhost:3000/api/search?keyword=<script>alert('XSS')</script>
// XSS Vulnerability Endpoint
app.get('/api/search', (req, res) => {
	let verified = false;
	try {
		verified = jsonwebtoken.verify(
			req.cookies.login,
			process.env.COOKIE_SECRET
		);
	} catch (err) {
		console.error('Error: jwt must be provided');
		res.sendStatus(500);
		return;
	}

	if (!verified) {
		res.sendStatus(403);
		return;
	}

	const query = `%${req.query.keyword}%`;
	connection.query(
		'SELECT username, CONCAT(fname, " ", lname) AS name FROM users WHERE username LIKE ?',
		[query],
		(err, results) => {
			if (err) res.sendStatus(500);
			else res.send(results);
		}
	);
});

// Ex. localhost:3000/api/profile?id=2
// Excessive Data Exposure Endpoint
app.get('/api/profile', (req, res) => {
	const query = req.query.id;
	connection.query(
		'SELECT username, fname, lname FROM users WHERE id = ?',
		[query],
		(err, results) => {
			if (err) {
				console.error(err);
				res.sendStatus(500);
				return;
			}
			res.send(results);
		}
	);
});

// Ex. localhost:3000/api/admin/drop-table
// Must be an admin to access this endpoint
// Missing Authentication Endpoint
app.get('/api/admin/drop-table', (req, res) => {
	jsonwebtoken.verify(
		req.cookies.login,
		process.env.ADMIN_SECRET,
		(err, decoded) => {
			if (err || !decoded.isAdmin) {
				res.sendStatus(403);
				return;
			}

			connection.query('DROP TABLE example', (err, _) => {
				if (err) {
					console.error('Error executing the query');
					res.sendStatus(500);
					return;
				}
				res.json({ message: 'Table dropped successfully' });
			});
		}
	);
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
