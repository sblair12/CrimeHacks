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

const port = process.env.PORT || 27017;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect(url);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Crime = require('./models/crime.js');

//ENDPOINTS
app.get('/data', (req, res) => {

	Crime.find({},
	(err, crimes) => {
      if (err) {
        res.send(err);
      }
	  res.json(crimes);
    });

});

app.post('/submitForm', (req, res) => {
  console.log("body: " + JSON.stringify(req.body));
  var crimeData = {
    date: req.body.date,
    time: req.body.time,
    category: req.body.type,
    description: req.body.description,
    lat: req.body.lat,
    lon: req.body.lng,
    gotLocation: true
  };
  console.log(crimeData);
  Crime.create(crimeData, function(error, crime) {
    if (error) {
        console.log(error);
        var responseData = {
          success: 'false',
        }
        res.send(responseData);
    } else {
      console.log("Successfuly created crime")
      var responseData = {
        success: 'true',
      }
      res.send(responseData);
    }

  });


});

app.use(express.static(path.join(__dirname, "public")));

app.get('*', function(req, res) {
  res.sendfile('./public/index.html');
});

app.listen(port, () => console.log(`Listening on port ${port}`));
