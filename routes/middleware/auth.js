/*
  middleware to obtain client's localStorage authentication object.
*/
const crypt = require('../../src/crypt.js');

const pattern = /[a-f0-9]{80}\_[a-f0-9]{32}/

var auth = function(req,res,next){
  console.log("verifying auth header");
  if (!isValid(req.headers['x-lsuser'],req.headers['x-lskey']))
    throw "No authentication provided"

  next();
}

function isValid(username,blob){
  if(pattern.test(blob)){
    var arr = blob.split('_')
    if (arr.length != 2 || (username === undefined))
      return false;

    crypt.validateUser(username,arr[0],arr[1], (valid) => {
      return valid;
    });
  }
  return false;
}

module.exports = auth;
