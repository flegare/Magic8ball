//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , port = (process.env.PORT || 8081);

//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.set('view options', { layout: false });
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "shhhhhhhhh!"}));
    server.use(connect.static(__dirname + '/static'));
    server.use(server.router);
});

//setup the errors
server.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.jade', { locals: { 
                  title : '404 - Not Found'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX' 
                },status: 404 });
    } else {
        res.render('500.jade', { locals: { 
                  title : 'The Server Encountered an Error'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX'
                 ,error: err 
                },status: 500 });
    }
});
server.listen( port);

//Setup Socket.IO
var io = io.listen(server);
io.sockets.on('connection', function(socket){
  console.log('Client Connected');
  socket.on('message', function(data){
    socket.broadcast.emit('server_message',data);
    socket.emit('server_message',data);
  });
  socket.on('disconnect', function(){
    console.log('Client Disconnected.');
  });
});


if (typeof String.prototype.startsWith != 'function') {
    // see below for better implementation!
    String.prototype.startsWith = function (str){
        return this.indexOf(str) == 0;
    };
}

// IP CONFIG
var os=require('os');
var ifaces=os.networkInterfaces();
var validIp = '0.0.0.0';
for (var dev in ifaces) {
    var alias=0;
    ifaces[dev].forEach(function(details){
        if (details.family=='IPv4') {
            console.log(dev+(alias?':'+alias:''),details.address);

            //TODO Huge hack to locate private ip, might want to improve this
            if(details.address.startsWith("192.168.")){
                validIp = details.address;
                console.log('Taking this ip: ' + validIp);
            }

            ++alias;
        }
    });
}

///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

server.get('/', function(req,res){
    res.render('welcome.jade', {ip : req.headers.host});
});

//welcome page
var ip = 'http://'+validIp+':' + port;
server.get('/welcome', function(req,res){
    res.render('welcome.jade', {ip : req.headers.host});
});

//control page
server.get('/ask', function(req,res){
    res.render('control.jade', {ip : ip});
});

//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

console.log('Listening on http://'+validIp+':' + port );
