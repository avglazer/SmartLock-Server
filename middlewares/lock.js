var Lock = require('../models/lock');

exports.getLocks = function(req,res){
	Lock.find({},
	function(err,lockRes){
		if(err){
			res.status(500);
			res.json({"status":"error","message":err});
		}else{
			res.status(200);
			res.json(lockRes);
		}
		return;
	});
};

exports.getLock = function(req, res){
	var lockid = req.params.lockid;
	if(!lockid){
		res.status(404);
		res.json({"status":"error","message":"Lockid wasn't entered"});
	}else{
		Lock.findOne({'lockid':lockid}, function(err, lock){
			if(err){
				res.status(500);
				res.json({"error":err});
			}else if(!lock){
				res.status(404);
				res.json([{"error":"Lock doesn't exist"}]);
			}else{
				res.status(200);
				res.json(lock);
			}
		});
	}
	return;
};

exports.addLock = function(req,res){
	var lock = req.body.lockid,
		status = req.body.lstatus;

	if(!lock){
		res.status(500);
		res.json({"status":"error","message":"No lockid was entered"});
	} else {
		var newlock = new Lock({
			lockid: lock,
			status: status
		});

		//if look exist, won't save him.
		Lock.findOneAndUpdate({'lockid': lock}, newlock, {upsert:true},
			function(err, doc){
				if (err){
					res.status(500);
					res.json({"status":"error","message": err });
				}else{
					res.status(200);
					res.json({"status":"success","message":"Lock "+lock+" was saved"});
				}
			});
	}
	return;
};

exports.removeLock = function(req,res){
	var lock= req.params.lockid;
	if(!lock){
		res.status(404);
		res.json({"status":"error","message":"Lock name wasn't supplied"});
	}else{	
		Lock.remove({"lockid":lock}, function(err,lock){
			if(err){
				res.status(500);
				res.json({"status":"error","message":err});
			}else{	
				res.status(200);
				res.json({"status":"sucess","message":"Lock "+lock+" was removed successfully"});
			}
		});
	}
	return;
};


exports.updateLockStatus= function(req,res){
	var lockid = req.params.lockid,
		status = req.params.lstatus;

	if(!lockid){
		res.status(500);
		res.json({"status":"error","message":"No lockid was entered"});
	} else {
		Lock.findOne({ "lockid": lockid }, function (err, lock){
			if(!lock){
				res.status(404);
				res.json({"status":"error","message": "The lock "+lock+" doesn't exist"});
			}else if(err){
				res.status(500);
				res.json({"status":"error","message":err});
			} else {
				lock.status = status;
				lock.save();
				res.status(200);
				res.json({"status":"success","message":"succeed update lock."});
			}
		});
	}
	return;
};