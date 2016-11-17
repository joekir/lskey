/*
  middleware to obtain client's localStorage authentication object.
*/
var auth = function(req,res,next){
  console.log("verifying auth header");
  if (!isValid(req.headers['x-lskey']))
    throw "No authentication provided"

  next();
}

//TODO
function isValid(blob){
  return (blob === 'abcdef213456');
}

module.exports = auth;
