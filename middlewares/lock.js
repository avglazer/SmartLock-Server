var Lock = require('../models/lock');
var Message = require('./message');
var Permission = require('../models/permission');
var valid = require('../helpers/validation');

exports.getLocks = function(req,res){
	Lock.find({},
	function(err,lockRes){
		if(err){
			Message.messageRes(req, res, 500, "error", err);
		}else{
			Message.messageRes(req, res, 200, "success", lockRes);
		}
		return;
	});
};

exports.getLock = function(req, res){
	var lockid = req.params.lockid;

	if(!lockid){
		Message.messageRes(req, res, 404, "error", "Lockid wasn't entered");
	}else{
		Lock.findOne({'lockid':lockid}, function(err, lock){
			if(err){
				Message.messageRes(req, res, 500, "error", err);
			}else if(!lock){
				Message.messageRes(req, res, 404, "error", "Lock doesn't exist");
			}else{
				Message.messageRes(req, res, 200, "success", lock);
			}
		});
	}
	return;
};

exports.getLocksByUser = function(req, res){
	if(req.session && req.session.user){//check if user loged in
		console.log("get locks:");
		console.log(req.session.user.username);
		var username = req.session.user.username;

		if(!username){
			Message.messageRes(req, res, 404, "error", "username wasn't entered");
		}else if(!valid.checkEmail(username)) {
			Message.messageRes(req, res, 200, "error", "username is Invalid email");
		}else{
			console.log("user:"+username);
			Permission.find({'username':username}, function(err, perRes){
				if(err){
					Message.messageRes(req, res, 500, "error", err);
				}else if(!perRes){
					Message.messageRes(req, res, 404, "error", "username doesn't exist");
				}else{
					var locks = [];

					if(!perRes.length){
						locks.push(perRes.lockid);
					} else {
						for(var i=0; i<perRes.length; i++){
							locks.push(perRes[i].lockid);
						}	
					}

					console.log(locks);
					
					Lock.find({"lockid":{$in:locks}},function(err,data){
						if(err){
							Message.messageRes(req, res, 500, "error", err);
						}else{
							Message.messageRes(req, res, 200, "success", data);

						}
						
					})
				}
			});
		}
		return;

	} else {
		Message.messageRes(req, res, 500, "error", "user didn't login");
	}
	
};

exports.addLock = function(req,res){
	var lock = req.body.lockid,
		status = req.body.lstatus;

	if(!lock){
		Message.messageRes(req, res, 500, "error", "No lockid was entered");
	} else if(!valid.checkStatus(status)) {
		console.log(status);
		Message.messageRes(req, res, 500, "error", "Wrong lock status");
	}else{
		var newlock = new Lock({
			lockid: lock,
			status: status
		});

		//if look exist, won't save him.
		Lock.findOneAndUpdate({'lockid': lock}, newlock, {upsert:true},
			function(err, doc){
				if (err){
					Message.messageRes(req, res, 500, "error", err);
				}else{
					Message.messageRes(req, res, 200, "success", "Lock "+lock+" was saved");
				}
			});
	}
	return;
};

exports.removeLock = function(req,res){
	var lock= req.params.lockid;
	if(!lock){
		Message.messageRes(req, res, 404, "error", "Lock name wasn't supplied");
	}else{	
		Lock.remove({"lockid":lock}, function(err,lock){
			if(err){
				Message.messageRes(req, res, 500, "error", err);
			}else{
				Message.messageRes(req, res, 200, "success", "Lock "+lock+" was removed successfully");

			}
		});
	}
	return;
};

exports.updateLockStatus= function(req,res, next){
	var lockid = (req.params.lockid) ? req.params.lockid:req.body.lockid,
		status = req.params.lstatus;

	if(!lockid){
		Message.messageRes(req, res, 500, "error", "No lockid was entered");
	} else if(!valid.checkStatus(status)) {
		Message.messageRes(req, res, 500, "error", "Wrong lock status");
	} else {
		Lock.findOne({ "lockid": lockid }, function (err, lock){
			if(!lock){
				Message.messageRes(req, res, 404, "error", "The lock "+lockid+" doesn't exist");
			}else if(err){
				Message.messageRes(req, res, 500, "error", err);
			} else {
				lock.status = status;
				lock.save();
				if(req.route.stack.length > 1){
					next();
				}else {
					Message.messageRes(req, res, 200, "success", "succeed update lock.");					
				}
			}
		});
	}
	return;
};

