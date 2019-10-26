const express = require('express');
const router = express.Router();
const Favorites = require("../models/favorites");
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');
router.use(bodyParser.json());


router.route("/")
.get(authenticate.verifyUser, (req,res,next)=>{
    console.log("DDDD");
    res.setHeader('Content-Type', 'application/json');
    // res.json({status:"ok",userId: req.user._id});

    Favorites.find({userId:req.user._id}).then(item=>{
        res.json(item);
    })
    // res.end()
})
.post(authenticate.verifyUser, (req,res,next)=>{
    res.setHeader('Content-Type', 'application/json');
    console.log("in post");

    req.body.forEach(async favorite=>{
        await Favorites.findOne({userId: req.user._id, dishId:favorite.id}).then(item=>{
           if(item){
              console.log("already added ",item);
           }else{
                new Favorites({
                    userId: req.user._id,
                    dishId: favorite._id
                }).save().then(saved=>{
                    console.log('saved', saved);
                    // res.json(saved);
                }).catch((err)=>{
                    console.log(err);
                    res.json(err);
                    res.end();
                    return false;
                })
           }
        })
    })
    res.json({status:"ok",opt:'postmany'});
}).delete(authenticate.verifyUser, (req,res,next)=>{
    Favorites.deleteMany({userId:req.user._id}).then(result=>{
        res.json({status:"ok",opt:'deletemany'});
        res.end();
    }).catch(err=>{
        res.json({
            err:err.message
        })
    });
})

router.route("/:dishId")
.post(authenticate.verifyUser, (req,res,next)=>{
    res.setHeader('Content-Type', 'application/json');
    console.log("in post");
    new Favorites({
        userId: req.user._id,
        dishId: req.body._id
    }).save().then(saved=>{
        console.log('saved', saved);
        res.json(saved);
    }).catch((err)=>{
            console.log(err);
        res.json(err);
    })
}).delete(authenticate.verifyUser, (req,res,next)=>{
    Favorites.deleteOne({userId:req.user._id, dishId: req.params.dishId}).then(result=>{
        res.json({status:"ok",opt:'deleteOne'});
        res.end();
    }).catch(err=>{
        res.json({
            err:err.message
        })
    });
});

module.exports = router;
