const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();
const fs = require("fs");
const path = require("path");
const dataPath = path.resolve("./data/");

promoRouter.use(bodyParser.json());

promoRouter.route('/').all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the promo to you!');
})
.post((req, res, next) => {
    res.end('Will add the promo: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next) => {
    res.end('Deleting all promos');
});



const writePromo = (req,res)=>{
    const id = req.params.promoId;
    console.log(req.body);
    if(!req.body.name || !req.body.description){
        res.statusCode=400;
        res.end("name and description required");
        return;
    }
    const filePath = dataPath+"/promo_"+id+".json";
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

promoRouter.route("/:promoId").all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    next();
})
.get((req,res)=>{
    const id = req.params.promoId;
    const filePath = dataPath+"/promo_"+id+".json";
    fs.exists(filePath, (exists)=>{
        if(!exists){
            res.statusCode=404;
            res.end(" promo id "+id+" not found");
            return;
        }
        fs.createReadStream(filePath).pipe(res);
    })
}).post(writePromo)
 .put(writePromo)
 .delete((req,res)=>{
    res.end('Deleting all promos');
})

module.exports = promoRouter;
