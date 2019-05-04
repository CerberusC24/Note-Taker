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
  // send tables.html when user hits "/notes"
  res.sendFile(path.join(__dirname, './html/notes.html'));
});

// API ROUTES

// GET all notes
app.get('/api/notes', function(req, res) {
  // query db for all table data
  connection.query('SELECT * FROM notes', function(err, noteData) {
    if (err) {
      return res.status(500).json(err);
    }
    // if no error, send back array of note data
    res.json(noteData);
  });
});

// Get one specific note
app.get("/api/notes/:id", function(req, res) {
  connection.query(`SELECT * FROM notes WHERE id = ?`, [req.params.id], function(err, noteData) {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(noteData);
  })
})

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

  // PUT route that takes in req.params and updates the database
  app.put(`/api/notes/:id`, function(req, res) {

      // update the note in the database
      connection.query(`UPDATE notes SET title = ?, body = ? WHERE id = ?`, [req.body.title, req.body.body, req.params.id], function(err, insertResult) {
        if (err) {
          console.log(err);
          return res.status(400).json(err);
        }
        // if note update is successful
        res.json({status: `update successful`});
      })
  })

  // DELETE route that takes in and deletes the note
  app.delete(`/api/notes/:id`, function(req, res) {

    // delete note from database using req.body.id as data
    connection.query(`DELETE FROM notes WHERE id = ?`, [req.params.id], function(err, insertResult) {
      if (err) {
        console.log(err);
        return res.status(400).json(err);
      }
        // if the delete was successful
        res.json({status: `note deleted`});
    })
  })



app.get('*', function(req, res) {
  res.send('<h1>404 Error!</h1>');
});

// turn on server, make sure this is last in the file
app.listen(PORT, () => console.log(`🗺 You are now on localhost:${PORT}.`));
