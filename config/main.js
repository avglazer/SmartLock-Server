process.env.ENV_VAR = process.env.ENV_VAR || "development";
var port = process.env.PORT || 3000;

var config={
	prodMongoUrl: 'mongodb://admin:Aa1234@ds147079.mlab.com:47079/final_project',
	devMongoUrl : 'mongodb://admin:191923@ds159180.mlab.com:59180/final_project-test'
};

var mongoUrl = (process.env.ENV_VAR == 'development') ? config.devMongoUrl : config.prodMongoUrl;
var domain = (process.env.ENV_VAR == 'development') ? "" : "smartlockproj.com";


module.exports ={
	"mongoUrl" : mongoUrl,
	"port" : port,
	"domain" : domain,
	"EMAIL_USER": process.env.EMAIL_USER || "x",
	"EMAIL_PASS": process.env.EMAIL_PASS || "x",
	'secret': process.env.SECRET || 'ilovescotchyscotch'
};