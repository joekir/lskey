const express = require('express'),
      router = express.Router();

var auth = require('./middleware/auth');

router.get('/',auth,(req, res, next) => {
  console.log('requesting home')
  res.sendFile("./public/home.html");
});

module.exports = router;
