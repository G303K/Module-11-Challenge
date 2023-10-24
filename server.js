const PORT = process.env.PORT || 3001; // Define the port for the server, using 3001 as a default if not specified in the environment.

const fs = require('fs'); // Import the 'fs' module for file system operations.
const path = require('path'); // Import the 'path' module to work with file paths.

const express = require('express');
const app = express(); // Create an instance of the Express application.

const allNotes = require('./db/db.json'); // Import the initial notes data from 'db.json'.

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); // Set up middleware for parsing JSON and serving static files.

app.get('/api/notes', (req, res) => {
    res.json(allNotes.slice(1)); // Respond to GET requests to '/api/notes' by sending the notes data, excluding the first element.
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html')); // Serve the main HTML file for the root route.
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html')); // Serve the HTML file for the '/notes' route.
});

// Function to create a new note.
function createNewNote(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];

    if (notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}

app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, allNotes);
    res.json(newNote); // Respond to POST requests to '/api/notes' by creating a new note and sending it as a JSON response.
});

// Function to delete a note by its ID.
function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, allNotes);
    res.json(true); // Respond to DELETE requests to '/api/notes/:id' by deleting the specified note and sending a 'true' response.
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`); // Start the Express server and listen on the specified port.
});
