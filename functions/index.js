const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = require();

// Routes
app.get('/hello-world', (req, res) => {
    return res.status(200).send('Hello World!');
});

//Create
//Post

//Update
//Get

// Delete

// Export the api to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);