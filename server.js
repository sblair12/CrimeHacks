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
const boundsJson = require('./bounds.json');

//ENDPOINTS
app.get('/data', (req, res) => {

	Crime.find({},
	(err, crimes) => {
      if (err) {
        res.send(err);
      }

      let bounds = spaceItems(crimes);

	  res.send({
          success: true,
          crimes: crimes,
          bounds: bounds
	  });
    });

});

let crimeStrings = ["burglary", "theft", "assault", "carjacking", "sexual", "nonviolent"];
let crimeBack = {
  burglary: 0,
  theft: 1,
  assault: 2,
  carjacking: 3,
  sexual: 4,
  nonviolent: 5
};

function spaceItems(data) {
    var set = new Set();

    let bounds = [];
    boundsJson.forEach((bound, index) => {
        bounds.push({
            name: bound.name,
            number: 0,
            types: []
        });
        crimeStrings.forEach((thing) => {
            bounds[index].types.push({
                name: thing,
                value: 0
            });
        })
        // bounds.list = [];
        // bounds[index].push(bound.name);
    });
    //console.log(bounds);
    var offset = 0.000025;
    //var alternate = 0;
    data.forEach((elem, index) => {
        if (elem.gotLocation && elem.lon !== undefined && elem.lat !== undefined) {
            if (set.has(elem.lon*elem.lat)) {
                while(true) {
                    //console.log(elem.lon);
                    var random = Math.floor(Math.random() * 8);
                    //console.log(random);
                    switch (random) {
                        case 0:
                            elem.lon += offset;
                            break;
                        case 1:
                            elem.lat += offset;
                            break;
                        case 2:
                            elem.lon -= offset;
                            break;
                        case 3:
                            elem.lat -= offset;
                            break;
                        case 4:
                            elem.lon += offset;
                            elem.lat += offset;
                            break;
                        case 5:
                            elem.lon -= offset;
                            elem.lat -= offset;
                            break;
                        case 6:
                            elem.lon += offset;
                            elem.lat -= offset;
                            break;
                        case 7:
                            elem.lon -= offset;
                            elem.lat += offset;
                            break;
                    }
                    if (!set.has(elem.lon*elem.lat)) break;
                }
                //alternate = (alternate + 1) % 8;
                set.add(elem.lon*elem.lat);
            }
            else {
                set.add(elem.lon*elem.lat);
            }
            //console.log(boundsJson);
            for (var x = 0; x < boundsJson.length; x++) {
                //console.log(`lat: ${elem.lat} -> ${boundsJson[x].topLat} ${boundsJson[x].bottomLat}`);
                //console.log(`lon: ${elem.lon} -> ${boundsJson[x].topLon} ${boundsJson[x].bottomLon}`);
                if (elem.lat <= boundsJson[x].topLat && elem.lat >= boundsJson[x].bottomLat &&
                    elem.lon >= boundsJson[x].topLon && elem.lon <= boundsJson[x].bottomLon) {
                    //console.log("push");
                    bounds[x].number += 1;
                    if (elem.category !== "") bounds[x].types[crimeBack[elem.category]].value += 1;
                    break;
                }
            }
        }
    });
    return bounds;
}

app.post('/submitForm', (req, res) => {
  var crimeData = {
    date: req.body.date,
    time: req.body.time,
    category: req.body.type,
    description: req.body.description,
    lat: req.body.lat,
    lon: req.body.lng,
    location: req.body.loc,
    gotLocation: true
  };
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
