const express = require('express');
const userRouter = express.Router();
const User = require("../models/user");
const bodyParser = require('body-parser');

userRouter.use(bodyParser.json());

userRouter
.post("/signup", (req, res, next) =>{
  User.findOne({username: req.body.username})
  .then((user)=>{
    if(user != null){
      next(new Error("User already exits"));
    }else{
      console.log(req.body);
      return User.create({
        username: req.body.username, password: req.body.password
      })
    }
  }).then((user)=>{
    res.status.code = 200;  
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Registration Successful!', user: user});
  }).catch(err => next(err));
})
.post("/login", (req, res, next) => {
  
  if(req.session && req.session.user){
    res.statusCode = 200;
    res.end("You are authenticated");
  }
  var authHeaders = req.headers.authorization;
  res.setHeader("WWW-Authenticate", "Basic"); 
  res.status = 401;
  if( !authHeaders) return next(new Error("You are not authenticate"));
  
    
  var auth = new Buffer.from(authHeaders.split(' ')[1], 'base64').toString().split(':');
  var username = auth[0];
  var password = auth[1];
  User.findOne({username: username}).then(user=>{
    if(user === null) return new Error("User not found");
    else if(user.password !== password) return new Error("Password not found");
      
    else if (user.username === username && user.password === password) {
      
      req.session.user = "authenticated";
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.json({status: 'Registration Successful!', user: user});
    }
  })  
});
module.exports = userRouter;

