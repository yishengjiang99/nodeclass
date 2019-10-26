const express = require('express');
const port = process.env.port || 3001;
var config = require('./config');
const url = config.mongoUrl;

var passport = require('passport');
var authenticate = require('./authenticate');

var app = express();

app.use(passport.initialize());

const userRouter  = require("./routes/userRouter");
const dishRouter  = require("./routes/dishRouter");
const uploadRouter = require('./routes/uploadRouter');
const favoriteRouter = require("./routes/favoriteRouter");
app.use("/public",            express.static("public"));
app.use("/uploadImage", uploadRouter);
app.use("/users",       userRouter);
app.use("/dishes",      dishRouter);
app.use("/favorites",   favoriteRouter);

const mongoose = require("mongoose");
mongoose.connect(url).then(() =>{
  console.log("mongo db connected");
}).catch((err)=>{
  console.err("mongo db not connected", err);
})

app.use(function(req, res, next) {
   res.statusCode=404;
   res.end();
});

/*
app.listen(port,()=>{
  console.log("listenign on port ",port);
})
*/
module.exports = app;
