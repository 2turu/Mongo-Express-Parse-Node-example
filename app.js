var express = require('express');
var debug = require('debug')('Express4');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/Loc8r';

var routes = require('./app_server/routes/index');
// var users = require('./app_server/routes/users');

if (!databaseUri) {
    console.log('DATABASE_URI not specified, falling back to localhost.');
  }
  
  var api = new ParseServer({
    databaseURI: databaseUri || 'mongodb://localhost:27017/Loc8r',
    cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
    appId: process.env.APP_ID || 'myAppId',
    masterKey: process.env.MASTER_KEY || 'appKey', //Add your master key here. Keep it secret!
    serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
  });
  // Client-keys like the javascript key or the .NET key are not necessary with parse-server
  // If you wish you require them, you can set them as options in the initialization above:
  // javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

app.use('/', routes);
// app.use('/users', users);

let ParseDashboard = require('parse-dashboard');
    app.use('/dashboard', new ParseDashboard({
        apps: [{
            serverURL: 'http://localhost:1337/parse',
            appId: 'myAppId',
            masterKey: 'appKey',
            appName: 'Loc8r',
        }],
        users: [{
            user: 'admin',
            pass: 'admin',
        }],
        useEncryptedPasswords: false,
}, true));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);

