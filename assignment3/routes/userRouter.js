const express = require('express');
const userRouter = express.Router();
const User = require("../models/user");
const bodyParser = require('body-parser');
const authenticate = require("../authenticate");
var passport = require('passport');

userRouter.use(bodyParser.json());

userRouter.get("/", authenticate.verifyUser, authenticate.verifyAdminUser, (req, res, next) =>{
  User.find({}).then(users=>{res.json(users); res.end()}).catch(console.log);
});

userRouter.post("/signup", (req, res, next) =>{
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      });
    }
  });
});

userRouter.post('/login', passport.authenticate('local'), (req, res) => {
  console.log("login");
  var token = authenticate.getToken({_id: req.user._id});
  console.log("login", token);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});
module.exports = userRouter;

