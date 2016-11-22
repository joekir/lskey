const express = require('express'),
      crypt = require('../src/crypt.js'),
      router = express.Router();


router.post('/',(req, res, next) => {
  crypt.createNewUser(req.body.email, (err,result) => {
    if(err || !result.ctext || !result.tag)
      res.status(500).end();

    var blob = result.ctext + "_" + result.tag;
    res.status(200).send({
      'blob': blob,
      'username' : req.body.email,
      'redir': '/home.html'
    });
  });

});

module.exports = router;
