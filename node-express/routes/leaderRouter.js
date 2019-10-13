const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();
const fs = require("fs");
const path = require("path");
const dataPath = path.resolve("./data/");

leaderRouter.use(bodyParser.json());

leaderRouter.route('/').all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the leader to you!');
})
.post((req, res, next) => {
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete((req, res, next) => {
    res.end('Deleting all leaders');
});



const writeLeader = (req,res)=>{
    const id = req.params.leaderId;
    console.log(req.body);
    if(!req.body.name || !req.body.description){
        res.statusCode=400;
        res.end("name and description required");
        return;
    }
    const filePath = dataPath+"/leader_"+id+".json";
    console.log("writing to "+filePath);
    const fh = fs.createWriteStream(filePath);

    fh.write(JSON.stringify({
        name: req.body.name,
        description: req.body.description
    }));
    fh.end();
    

    fh.on("finish",()=>{
        res.statusCode=200;
        res.statusMessage="wrote";
        res.end("wrote file");
    })
    fh.on("error",(e)=>{
        res.statusCode=500;
        res.statusMessage = e.message;
        res.end("error writing to file");
    })
};

leaderRouter.route("/:leaderId").all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    next();
})
.get((req,res)=>{
    const id = req.params.leaderId;
    const filePath = dataPath+"/leader_"+id+".json";
    fs.exists(filePath, (exists)=>{
        if(!exists){
            res.statusCode=404;
            res.end("leader id "+id+" not found");
            return;
        }
        fs.createReadStream(filePath).pipe(res);
    })
}).post(writeLeader)
 .put(writeLeader)
 .delete((req,res)=>{
    res.end('Deleting all leader');
})

module.exports = leaderRouter;
