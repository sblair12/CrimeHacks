//====LIST DEPENDENCIES===//
const express = require('express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongoose = require('mongoose').set('debug', true);
const app = express();
const url = 'mongodb+srv://crimedb:wTEBNvklC8J5yFNC@crimedb-um97o.mongodb.net/crimeDB?retryWrites=true';
const dotenv = require("dotenv").config();
const fetch = require('node-fetch');
var dateFormat = require('dateformat');
//=========================//

const port = process.env.PORT || 5000;
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

mongoose.connect(url);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Crime = require('./models/crime.js');

//ENDPOINTS
app.post('/data', (req, res) => {
	
	Crime.find({}, 
	(err, crimes) => {
      if (err) {
        res.send(err);
      }
	  res.json(crimes);
    });
	
});


app.use(express.static(path.join(__dirname, "public")));

app.get('*', function(req, res) {
  res.sendfile('./public/login.html');
 });

app.listen(port, () => console.log(`Listening on port ${port}`));