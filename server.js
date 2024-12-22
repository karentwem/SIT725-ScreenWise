const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const { postActivity } = require('./public/js/offlineActivity');
const { postChild } = require('./public/js/child');


// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the public folder


// API endpoint to add offline activity
app.post('/api/offline-activity', (req, res) => {
    const activity = req.body;

    postActivity(activity, (err, result) => {
        if (err) {
            return res.status(500).send('Error inserting activity');
        }
        res.status(201).send('Activity added successfully');
    });
});

// API endpoint to add child record
app.post('/api/child', (req, res) => {
    const child = req.body;

    postChild(child, (err, result) => {
        if (err) {
            return res.status(500).send('Error inserting child record');
        }
        res.status(201).send('Child record added successfully');
    });
});

// More endpoints for other operations...

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});