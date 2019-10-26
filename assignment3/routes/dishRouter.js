const express = require('express');
const bodyParser = require('body-parser');
const dishRouter = express.Router();
const Dishes = require("../models/dishes");
const cors = require('../cors');

var authenticate = require('../authenticate');

const errorResponse = ((err, res) => {
    res.statusCode = 500;
    res.json({
        message: err.message
    });
})

dishRouter.use(bodyParser.json());

dishRouter.route('/').all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyAdminUser, (req, res, next) => {
        console.log("god dit");
        Dishes.find({}).populate('comments.author')
            .then(dishes => {
                res.json(dishes);
                res.end();
            }).catch(err => {
                errorResponse(err, res);
            })
    })
    .post(cors.corsWithOptions, authenticate.verifyAdminUser, (req, res, next) => {
        const obj = req.body;
        var newdish = new Dishes({
            name: obj.name,
            price: obj.price || 0,
            category: obj.category || "indian",
            image: obj.image || "abc",
            label: obj.label || "",
            featured: obj.featured || false,
            description: obj.description || "abc"
        });
        console.log(newdish);

        newdish.save().then((saved) => {
            console.log(saved);
            res.json(saved);
            res.end();
        }).catch(err => {
            console.log(err);
            errorResponse(err, res);
        })
    })
    .put(authenticate.verifyAdminUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete(authenticate.verifyAdminUser, (req, res, next) => {
        Dishes.deleteMany({}).then((result) => {
                res.json(result);
            })
            .catch(err => errorResponse(err, res));
    });


dishRouter.route("/:dishId").all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        next();
    })
    .get(authenticate.verifyAdminUser, (req, res) => {
        dishes.findOne({
                _id: req.params.dishId
            })
            .populate('comments.author')
            .then((item) => {
                res.json(item);
                res.end();
            })
    })
    .post(authenticate.verifyAdminUser, (req, res) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /promotions/:promoID');
    })
    .put(authenticate.verifyAdminUser, (req, res) => {
        dishes.findByIdAndUpdate(req.params.dishId, req.body)
            .then(result => res.json(result))
            .catch(err => errorResponse(err, res));
    })
    .delete(authenticate.verifyAdminUser, (req, res) => {
        dishes.deleteOne({
                _id: req.params.dishId
            })
            .then(result => res.json(result))
            .catch(err => errorResponse(err, res));
    });


dishRouter.route("/:dishId/comments").all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        next();
    })
    .get((req, res) => {
        dishes.findOne({
                _id: req.params.dishId
            })
            .populate('comments.author')
            .then((item) => {
                res.json(item);
                res.end();
            })
    })
    .post(authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        dishes.findOne({
            _id: req.params.dishId
        })
        .populate('comments.author')
        .then((item) => {
            if(item && item.comments){
                item.comments.push({
                    author: req.user._id,
                    comment: req.body.comment,
                    rating: req.body.rating || 5
                })
                item.save();
            }
            res.json({status:'ok'});
            res.end();
        })

        res.end('POST operation not supported on /dishes/:dishId/comments');
    })
    .put(authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUST operation not supported on /dishes/:dishId/comments');
    })
    .delete(authenticate.verifyAdminUser, (req, res) => {
        dishes.deleteOne({
                _id: req.params.dishId
            })
            .then(result => res.json(result))
            .catch(err => errorResponse(err, res));
    });

    dishRouter.route("/:dishId/comments/:commentId")
    .get((req,res)=>{
        res.statusCode = 403;
        res.end("not supported")
    }).post((req,res)=>{
        res.statusCode = 403;
        res.end("not supported")  
    }).put(authenticate.verifyUser, (req,res,next)=>{
        dishes.findOne({
            _id: req.params.dishId
        })
        .populate('comments.author')
        .then((item) => {
            item.comments.forEach((comment)=>{
                if(comment.id == req.params.commentId){
                    if(req.user._id !== comment.author){
                        next(new Error("You cannot edit someone elses comment"));
                    }
                    comment.comment = req.body.comment;
                }
            })
            item.save();
            res.end("deleted");
        })
        
    }).delete(authenticate.verifyUser, (req,res,next)=>{
        dishes.findOne({
            _id: req.params.dishId
        })
        .populate('comments.author')
        .then((item) => {
            item.comments.forEach((comment)=>{
                if(comment.id == req.params.commentId){
                    if(req.user._id !== comment.author){
                        next(new Error("You cannot delete someone elses comment"));
                    }
                    comment.remote();
                }
            })
            item.save();
            res.end("deleted");
        })
    })
module.exports = dishRouter;
