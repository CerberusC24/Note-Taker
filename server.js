// import dependencies
const express = require('express');
const connection = require('./db/connection');
const path = require('path');

// create server using express() and set a port
const app = express();
const PORT = process.env.PORT || 3000;

// set up our middleware to handle incoming POST data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set up our routes
app.get('/', function(req, res) {
  // send home.html when user hits "root"
  res.sendFile(path.join(__dirname, './html/home.html'));
});

app.get('/notes', function(req, res) {
  // send notes.html when user hits "/tables"
  res.sendFile(path.join(__dirname, './html/notes.html'));
});

// GET all notes in a JSON page
app.get('/api/notes', function(req, res) {
  // query db for all notes data
  connection.query('SELECT * FROM notes', function(err, notesData) {
    if (err) {
      return res.status(500).json(err);
    }
    // if no error, send back array of table data
    res.json(notesData);
  });
});

// POST route that takes in req.body and creates a new note
app.post('/api/notes', function(req, res) {
  // insert new note using req.body as data
  connection.query('INSERT INTO notes SET ?', req.body, function(err, insertResult) {
    if (err) {
      console.log(err);
      return res.status(400).json(err);
    }
    // if insert was successful
    res.json({ status: 'successful' });
  });
});

// Keep this at the bottom after all the routes but before the .listen
app.get('*', function(req, res) {
  res.send('<h1>404 Error!</h1>');
});

// turn on server, make sure this is last in the file
app.listen(PORT, () => console.log(`🗺 You are now on localhost:${PORT}.`));