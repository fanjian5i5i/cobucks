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

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


var connections = [];

var csvCache = [];
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
router.get('/runPython', function (req, res) {
  var options = {
    args:[req.query.workspace,req.query.street,req.query.parcel,req.query.output]
  };
  console.log(options);
  res.send("request received")
  PythonShell.run(path.resolve('test.py'), options, function (err,results) {
    if (err) throw err;
    console.log('results: %j', results);
    io.sockets.emit('new message',{msg:results})
  });

});
router.get("/downloadCSV",function(req,res){
  console.log(req.query);

  var file = req.query.parameters
  if(req.query.parameters){
    csvCache=[];
    csvCache.push(req.query.parameters.toString());
    res.download(path.resolve(req.query.parameters.toString()));
  }
  else{
    // res.send("Error downloading")
    res.download(path.resolve(csvCache[0]));
  }
  // res.send(req)
})
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
      url:"https://cs64.salesforce.com/services/data/v20.0/query/?q=SELECT+Lat__c,Lon__c,ProjectStatus__c,Name,ProjectID__c,Owner.Name+from+Project__c+WHERE+RecordType.Name+IN+('Large Project','Small Project','NPC')",
      headers:{
        'Authorization': 'Bearer '+JSON.parse(body).access_token
      }
    }, function optionalCallback(err, httpResponse, body2) {
      var r = [];

      JSON.parse(body2).records.forEach(function(record){
        if(record.Lat__c<0){record.Lat__c=record.Lat__c*-1}
        if(record.Lon__c>0){record.Lon__c=record.Lon__c*-1}
        if(record.Lat__c==null){record.Lat__c=1.0}
        if(record.Lon__c==null){record.Lon__c=1.0}
        r.push({"name":record.Name,"status":record.ProjectStatus__c,"id":record.ProjectID__c,"owner":record.Owner.Name,"lat":record.Lat__c,"lon":record.Lon__c})
      })
      res.send(r);
    });
  });

});
app.use('/', router);
// app.listen(port, function(error) {
//   if (error) throw error;
//   console.log("Express server listening on port", port);
// });

server.listen(process.env.PORT|| 3000,function(error){
  if (error) throw error;
  console.log("Express server listening on port", port);
});

io.sockets.on('connection',function(socket){
  // connections.push(socket);
  console.log("Connected: %/s sockets connected:" + connections.length);

  socket.on('disconnect',function(socket){
    connections.splice(connections.indexOf(socket),1);
    console.log("Disconnected: %s sockets connected",connections.length)
  });

  // socket.on('new message',function(data){
  //   io.sockets.emit('new message',{msg:data});
  // })
  // if()
});
