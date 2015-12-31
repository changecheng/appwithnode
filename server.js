

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var LOAD_FILE = path.join(__dirname, '/public/data/pageData.json');
var SAVE_FILE = path.join(__dirname, '/public/data/pageData_save.json');
var LOAD_FILE_PROJECT = path.join(__dirname, '/public/data/projectData.json');
var SAVE_FILE_PROJECT = path.join(__dirname, '/public/data/projectData_save.json');
app.set('port', (process.env.PORT || 3000));

//app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/page', function(req, res) {
  fs.readFile(LOAD_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.setHeader('Cache-Control', 'cache');
    res.json(JSON.parse(data));
  });
});

app.get('/api/project', function(req, res) {
  fs.readFile(LOAD_FILE_PROJECT, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.setHeader('Cache-Control', 'cache');
    res.json(JSON.parse(data));
  });
});
app.post('/api/project', function(req, res) {
  // console.log(req.body);
  // console.log('readFile '+SAVE_FILE);
  fs.readFile(LOAD_FILE_PROJECT, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log("req");
    var dataJson = JSON.parse(req.body.data);

    fs.writeFile(LOAD_FILE_PROJECT, JSON.stringify(dataJson,null,4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.end('ok'); 
    });
  });
});
app.post('/api/page', function(req, res) {
  // console.log(req.body);
  // console.log('readFile '+SAVE_FILE);
  fs.readFile(SAVE_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log("req");
    var dataJson = JSON.parse(req.body.data);

    fs.writeFile(SAVE_FILE, JSON.stringify(dataJson,null,4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.end('ok'); 
    });
  });
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
