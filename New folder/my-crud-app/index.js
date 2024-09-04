const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.json());

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Password',
    database: 'contacts_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Create a new contact
app.post('/createContact', (req, res) => {
    const { first_name, last_name, email, mobile_number, data_store } = req.body;

    if (data_store === 'DATABASE') {
        const query = `INSERT INTO contacts (first_name, last_name, email, mobile_number) VALUES (?, ?, ?, ?)`;
        db.query(query, [first_name, last_name, email, mobile_number], (err, result) => {
            if (err) throw err;
            res.send({ message: 'Contact added to Database', contact_id: result.insertId });
        });
    }
});

// Get a contact by ID
app.post('/getContact', (req, res) => {
    const { contact_id, data_store } = req.body;

    if (data_store === 'DATABASE') {
        const query = `SELECT * FROM contacts WHERE id = ?`;
        db.query(query, [contact_id], (err, result) => {
            if (err) throw err;
            res.send(result[0]);
        });
    }
});

// Update a contact by ID
app.post('/updateContact', (req, res) => {
    const { contact_id, new_email, new_mobile_number, data_store } = req.body;

    if (data_store === 'DATABASE') {
        const query = `UPDATE contacts SET email = ?, mobile_number = ? WHERE id = ?`;
        db.query(query, [new_email, new_mobile_number, contact_id], (err, result) => {
            if (err) throw err;
            res.send({ message: 'Contact updated in Database' });
        });
    }
});

// Delete a contact by ID
app.post('/deleteContact', (req, res) => {
    const { contact_id, data_store } = req.body;

    if (data_store === 'DATABASE') {
        const query = `DELETE FROM contacts WHERE id = ?`;
        db.query(query, [contact_id], (err, result) => {
            if (err) throw err;
            res.send({ message: 'Contact deleted from Database' });
        });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
