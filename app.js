const express = require('express'),
      helmet = require('helmet'),
      hsts = require('hsts'),
      csp = require('helmet-csp'),
      morgan = require('morgan')
      bodyParser = require('body-parser');

var app = express();

var registration = require('./routes/registration'),
    home = require('./routes/home'),
    auth = require('./routes/middleware/auth');

/*
app.use(helmet());
app.use(hsts({
  maxAge: 15552000,  // 180 days
  setIf: function (req, res) {
    // for the nginx reverse proxy
    return req.secure || (req.headers['x-forwarded-proto'] === 'https')
  }
}));
*/

app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get("/", (req,res) => {
  res.sendFile("./public/index.html");
});

/*
  Just a stub to do auth checks over XHR
*/
app.post('/', auth, (req,res) => {
  res.send({
    'redir' : '/home.html'
  });
})

app.use("/register",registration);
app.use("/home",home);

// Catch other stuff and deny.
app.use(function(err, req, res, next) {
    res.redirect(403,"back");
});

var port = 2000;

app.listen(port, function () {
  console.log('Listening on port: ' + port);
})
