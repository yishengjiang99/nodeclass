const express = require('express');
const userRouter = express.Router();
const User = require("../models/user");
const bodyParser = require('body-parser');
var passport = require('passport');

userRouter.use(bodyParser.json());

userRouter
.post("/signup", (req, res, next) =>{
  console.log(req.blody);
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
})
.post("/login", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'You are successfully logged in!'});
})
module.exports = userRouter;

