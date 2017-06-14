var express = require('express');
var path = require('path');
var config = require('../webpack.config.js');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var PythonShell = require('python-shell');
var $ = require('jquery');
var request = require('request');

var app = express();

var compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath}));
app.use(webpackHotMiddleware(compiler));

app.use(express.static('./dist'));

// app.use('/', function (req, res) {
//     res.sendFile(path.resolve('client/index.html'));
// });





var port = 3000;
var router = express.Router();

router.get('/', function (req, res) {
    res.sendFile(path.resolve('client/index.html'));
});
router.get('/gettoken', function (req, res) {
  request.post({
    url:'https://test.salesforce.com/services/oauth2/token',
    form:{
      grant_type: "password",
      client_id: "3MVG967gVD5fuTmK6J_4Iya9ly5L.wtPiBhT_yc0av5p9Ve6op2q1uTGynfpezRC00eZIMUFJYuXlm1PjmbpH",
      client_secret: "6219097016392574469",
      username: "duser@boston.gov.dev",
      password: "BPD4!-Dstuffy123"
    }
  }, function optionalCallback(err, httpResponse, body) {
    console.log(body)
    res.send(body);
  });

});
router.get('/getprojects', function (req, res) {
  request.post({
    url:'https://test.salesforce.com/services/oauth2/token',
    form:{
      grant_type: "password",
      client_id: "3MVG967gVD5fuTmK6J_4Iya9ly5L.wtPiBhT_yc0av5p9Ve6op2q1uTGynfpezRC00eZIMUFJYuXlm1PjmbpH",
      client_secret: "6219097016392574469",
      username: "duser@boston.gov.dev",
      password: "BPD4!-Dstuffy123"
    }
  }, function optionalCallback(err, httpResponse, body) {
    console.log(body);

    request.get({
      url:'https://cs64.salesforce.com/services/data/v20.0/query/?q=SELECT+Lat__c,Lon__c+from+Project__c',
      headers:{
        'Authorization': 'Bearer '+JSON.parse(body).access_token
      }
    }, function optionalCallback(err, httpResponse, body2) {

      res.send(body2);
    });
  });

});
app.use('/', router);
app.listen(port, function(error) {
  if (error) throw error;
  console.log("Express server listening on port", port);
});

PythonShell.run(path.resolve('test.py'), function (err,results) {
  if (err) throw err;
  console.log('results: %j', results);
});
