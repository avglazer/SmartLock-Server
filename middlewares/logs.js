var Logs = require('../models/logs');
var Message = require('./message');
var Permission = require('../models/permission');


exports.getLogs = function(req,res){
	var username = req.params.username;
	var userPermissions = req.UserPer;
	var relevantLogs = [];

	Logs.find({},
	function(err,logs){
		if(err){
			Message.messageRes(req, res, 500, "error", err);
		}else{

			if(userPermissions){
				for(var i=0; i<userPermissions.length; i++){

					var perType = userPermissions[i].type;

					switch(perType){
						//manager
						case 0:
							for(var j=0; j< logs.length; j++){
								if(logs[j].lockid == userPermissions[i].lockid){
									relevantLogs.push(logs[j]);
								}
							}
							break;
						//user
						case 1:case 2:
							for(var j=0; j< logs.length; j++){
								if((logs[j].lockid == userPermissions[i].lockid) && (logs[j].username == userPermissions[i].username) ){
									relevantLogs.push(logs[j]);
								}
							}
							break;
					}
				}
				Message.messageRes(req, res, 200, "success", relevantLogs);
			} else {
				Message.messageRes(req, res, 200, "error", "No permissions");
			}
			
			return;

		}
		return;
	});
};


exports.writeLog = function(req,res){
	var username = req.params.username,
	    lockid = req.params.lockid,
	    action = req.params.action,
	    physicId = req.physicId,
	    time = new Date();

		var newlog = new Logs({
			lockid: lockid,
			username: username,
			action: action,
			physicalid: physicId,
			time : time
		});

		//if look exist, won't save him.
		newlog.save(function(err, doc){
				if (err){
					console.log("log error");
					conosle.log(err);
				}else{
					console.log("log was saved");
				}
			});
	
	return;
};