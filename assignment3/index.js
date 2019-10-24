const express = require('express');
const cookieParser = require("cookie-parser");
const port = process.env.port || 3001;
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var app = express();

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

function auth (req, res, next) {
  req.session && req.session.user && 
  req.session.user === 'authenticated' &&
  next() ||
  next(new Error("You are not authenticated"));
}

const userRouter = require("./routes/userRouter");
app.use("/users", userRouter);

app.use(auth);
app.use("/", (req,res)=>{
  res.end("hi");
});


const mongoose = require("mongoose");
const url = process.env.mongo_uri || 'mongodb://localhost:27017/conFusion';
mongoose.connect(url).then(() =>{
  console.log("mongo db connected");
}).catch((err)=>{
  console.err("mongo db not connected", err);
})

app.use(function(req, res, next) {
   res.statusCode=404;
   res.end();
});

app.listen(port,()=>{
  console.log("listenign on port ",port);
})
module.exports = app;
