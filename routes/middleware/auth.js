/*
  middleware to obtain client's localStorage authentication object.
*/
const crypt = require('../../src/crypt.js');

const pattern = /[a-f0-9]{80}\_[a-f0-9]{32}/
var count = 0;

var auth = function(req,res,next){
  isValid(req.headers['x-lsuser'],req.headers['x-lskey'], function(valid) {
    // HACK - THIS IS TERRIBLE I need to figure how to use promises properly!

    console.log('valid user : %s [count %d]',valid,count);
    if (count === 1){
      count=0;
      if(valid === true)
        next()
      else
        res.status(401).send({error: 'Could not validate user.'})
    } else
      ++count;
  });
}

function isValid(username,blob,done){
  if(pattern.test(blob)){
    var arr = blob.split('_')
    if (arr.length != 2 || (username === undefined))
      done(false);

    crypt.validateUser(username,arr[0],arr[1], (valid) => {
      done(valid);
    });
  }
  done(false);
}

module.exports = auth;
