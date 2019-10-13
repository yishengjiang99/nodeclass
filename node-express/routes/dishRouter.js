const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();
const fs = require("fs");
const path = require("path");
const dataPath = path.resolve("./data/");

dishRouter.use(bodyParser.json());

dishRouter.route('/').all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the dishes to you!');
})
.post((req, res, next) => {
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
    res.end('Deleting all dishes');
});



const writeDish = (req,res)=>{
    const id = req.params.dishId;
    console.log(req.body);
    if(!req.body.name || !req.body.description){
        res.statusCode=400;
        res.end("name and description required");
        return;
    }
    const filePath = dataPath+"/dish_"+id+".json";
    const fh = fs.createWriteStream(filePath);

    fh.write(JSON.stringify({
        name: req.body.name,
        description: req.body.description
    }));

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
    fh.end();
};

dishRouter.route("/:dishId").all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    next();
})
.get((req,res)=>{
    const id = req.params.dishId;
    const filePath = dataPath+"/dish_"+id+".json";
    fs.exists(filePath, (exists)=>{
        if(!exists){
            res.statusCode=404;
            res.end(id+" dish not found");
            return;
        }
        fs.createReadStream(filePath).pipe(res);
    })
}).post(writeDish)
 .put(writeDish)
 .delete((req,res)=>{
    res.end('Deleting all dishes');
})

module.exports = dishRouter;
