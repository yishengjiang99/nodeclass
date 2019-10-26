const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Currency = require("mongoose-currency");
const commentSchema = new Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            min:1,
            max:5,
            requier:true
        }
    }
    ,{
        timestamp:true
    })
    const dishSchema = new Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        label: {
            type: String,
            default: ''
        },
        price: {
            type: Currency,
            required: true,
            min: 0
        },
        featured: {
            type: Boolean,
            default:false      
        },
        comments:[commentSchema]
    }, {
        timestamps: true
    });
    

var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;
