var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var sessions = require('./sessions.js');
var db = require('./database');
var consts = require('./consts');
// var whiteListDomains = ["https://smartlockproj.com", "http://127.0.0.1:8000"];

app.set('port', consts.port);

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(sessions());

app.use('/', express.static('./public'));
app.use(function(req, res, next){
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Origin', consts.headerOrigin);
	res.header('Access-Control-Allow-Header', "Origin, X-Requested-With, Content-Type, Accept");
	app.set('json spaces', 4);
	res.set('Content-Type', "application/json");
	next();
});

require('./routes/lockRequest')(app);
require('./routes/lock')(app);
require('./routes/permission')(app);
require('./routes/user')(app);
require('./routes/message')(app);

app.listen(consts.port);

console.log('The server is running on port '+ consts.port);