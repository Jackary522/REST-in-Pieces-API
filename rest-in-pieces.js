import express from 'express';
import mysql from 'mysql';

// Create a connection to the database
const connection = mysql.createConnection({
	host: '127.0.0.1',
	port: 3306,
	user: 'api_user',
	password: 'newpassword',
	database: 'api_security',
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

// Ex. localhost:3000/api/users/' OR '1'='1
// SQL Injection Vulnerability Endpoint
app.get('/api/users/:username', (req, res) => {
	const username = req.params.username;
	console.log(req.params);
	if (!username) {
		res.status(400).send('Username is required');
		return;
	}
	const sql = `SELECT username FROM users WHERE username = '${username}'`;
	connection.query(sql, (err, results) => {
		if (err) {
			console.error(err);
			return;
		}
		console.log(results);
		res.send(results);
	});
});

// Ex. localhost:3000/api/documents/1
// IDOR Vulnerability Endpoint
app.get('/api/documents/:id', (req, res) => {
	const id = req.params.id;
	const sql = `SELECT * FROM documents WHERE id = '${id}'`;
	connection.query(sql, (err, results) => {
		if (err) {
			console.error('Error executing the query');
			return;
		}
		res.send(results);
	});
});

// Ex. localhost:3000/api/search?keyword=<script>alert('XSS')</script>
// XSS Vulnerability Endpoint
app.get('/api/search', (req, res) => {
	const query = req.query;
	res.send(`<h1>Search results for ${query.keyword}</h1>`);
});

// Ex. localhost:3000/api/profile?id=2
// Excessive Data Exposure Endpoint
app.get('/api/profile', (req, res) => {
	const query = req.query;
	const sql = `SELECT * FROM users WHERE id = '${query.id}'`;
	connection.query(sql, (err, results) => {
		if (err) {
			console.error('Error executing the query');
			return;
		}
		res.send(results);
	});
});

// Ex. localhost:3000/api/admin/drop-table
// Missing Authentication Endpoint
app.get('/api/admin/drop-table', (req, res) => {
	const sql = `DROP TABLE example`;
	connection.query(sql, (err, results) => {
		if (err) {
			console.error('Error executing the query');
			return;
		}
		res.send('Table dropped successfully');
	});
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
