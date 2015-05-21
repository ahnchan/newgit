var oauthServer = require('http'),
    express = require('express'),
    bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extened:true}));
app.use(bodyParser.json());
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', ['Content-Type', 'Authorization']);
  next();
});

var checkAuth = function(req, res, next) {
 
    console.info('Auth:' + req.header('Authorization'));
    var str = '';
    
    var options = {
            host: '127.0.0.1',
            port: 3030,
            path: '/oauth/auth',
            headers: {Authorization:req.header('Authorization')},
            method: 'GET'
        };
    
    var request = oauthServer.request(options, function(response) {
        
        response.on('data', function (data) {
            str+= data;
        });
        response.on('end', function() {
            console.info('status:'+response.statusCode);
            if (response.statusCode == 200) {
                next();
            } else {
                res.send('error auth');
            }
        });
                    
    });
    request.end();
    request.on('error', function(err) {
        console.log('error:'+err);
        res.send('err');
    });
        
};

app.get('/test', checkAuth, function(req, res) {
    res.send("TEST Page");
});
        

var server = app.listen(3031, function() {
    var host = server.address().address;
    var port = server.address().port;
    
    console.info('read http://%s:%s', host, port);
    
});