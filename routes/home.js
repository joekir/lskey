const express = require('express'),
      router = express.Router();

var auth = require('./middleware/auth');

router.post('/',auth,(req, res) => {
  console.log('in post request')
  res.type('json');
  res.status(200).send({ redir: '/home' })
});

module.exports = router;
