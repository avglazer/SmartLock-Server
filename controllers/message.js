
exports.helloMessage = function(req,res){
    res.status(200);
    res.send("Hello World");
}

exports.errorMessage = function(req,res){
    res.status(404);
    res.json({"error":"wrong url - look at the api - https://github.com/Avitalg/SmartLock-Server/blob/master/README.md"});
};

exports.errorMessageAll = function(req,res){
    res.status(404);
    res.json({"error":"URL starts with /api/"});
};
