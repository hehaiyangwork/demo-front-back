var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan'); // HTTP request logger middleware
var cookieParser = require('cookie-parser'); // Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
var bodyParser = require('body-parser');
var request = require('request');

var fs=require('fs');
var mine=require('./mine').types;
var httpProxy = require('http-proxy');
var url=require('url');
var rpcProxy = require('hessian-proxy').Proxy;

var yaml = require('js-yaml');

var exphbs  = require('express-handlebars');

var app = express();

// 前端工程根目录
var rootDir ="/Users/hehaiyang/workspace/other/node-handlebars";

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('views', path.join(rootDir, 'views'));
app.engine('hbs', exphbs({
  partialsDir:  path.join(rootDir, 'views/partials'),
  layoutsDir:  path.join(rootDir, 'views/layouts'),
  defaultLayout: 'layout',
  extname: '.hbs',
  helpers: require('./helper')
}));
app.set('view cache', false);
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(rootDir, 'public')));


//跨域请求服务端口
var proxyURL = "http://localhost:8088";

var proxy = httpProxy.createProxyServer({ target: proxyURL });

proxy.on('error', function(err, req, res){
    res.writeHead(500, {
        'content-type': 'text/plain'
    });
    console.log(err);
    res.end('Something went wrong. And we are reporting a custom error message.');
});

function getToken(req){
  if(req.cookies.token){
      return token = req.cookies.token
  }else if(req.header("token")){
      return token = req.header("token")
  }else if(req.query.token){
      return token = req.query.token
  }
  return ""
}

app.use(function(req, res, next) {
  req.url = req.url === "/" ? "/index" : req.url
  // console.log('Cookies: ', req.cookies)
  var pathname = url.parse(req.url).pathname
  var realPath = path.join(rootDir, 'views', pathname) + '.hbs';
  // var realPath = path.join("./", pathname);

  var ext = path.extname(realPath);
  ext = ext ? ext.slice(1) : 'unknown'

  //判断如果是接口访问，则通过proxy转发
  if(req.url.indexOf("api") > 0){
      console.log("Invoke api: " + req.url);
      proxy.web(req, res, { headers: {
        'Token': getToken(req)
      }});
      return;
  }

  fs.exists(realPath, function (exists) {
      console.log("Invoke path: " + req.url);
      if (!exists) {
          res.writeHead(404, {
              'Content-Type': 'text/plain'
          });
          res.write("This request URL " + pathname + " was not found on this server.");
          res.end();
      } else {
          var url = '/'
          try {
              var filePath = path.join(rootDir, "mapping") + '.yaml';
              var doc = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'), {
                json: true,
              });
              if(doc[pathname.substring(1)]){
                url = doc[pathname.substring(1)]["url"];

                console.log("Invoke api: " + url);
                var options = {
                  baseUrl: proxyURL,
                  url: url,
                  headers: {
                    'Token': getToken(req)
                  }
                };
                request(options, function (error, response, body) {
                  // console.log('error:', error); // Print the error if one occurred
                  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                  // console.log('body:', body); // Print the json data
                    res.render(realPath, { title: 'node-proxy', data: JSON.parse(body)});
                });
              }else{
                res.render(realPath, { title: 'node-proxy', data2: proxy});
              }
          } catch (err) {
              next(err);
          }
      }
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
