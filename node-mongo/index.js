const mongoose = require("mongoose");
const url = 'mongodb://localhost:27017/conFusion';
const Dishes = require("./models/dishes");
const connect = mongoose.connect(url);


connect.then((client) => {
    console.log('Connected correctly to server');
    // const db = client.db(dbname);
    var newDish = Dishes({
        name:"pizza444",
        description:"test"
    });
    newDish.save()
    .then((dish)=>{
        dish.name='yisheng2';
        dish.save();
        
        console.log(JSON.stringify(dish));
        return Dishes.findByIdAndUpdate(dish._id,{
            description:"yisheng dish"
        },{
            new: true
        }).exec();
    }).then((dish)=>{
        dish.comments.push({
            rating:5,
            comment:"great",
            author:"yisheng"
        })
        return dish.save();
    }).then((dish)=>{
        console.log(JSON.stringify(dish));
        return mongoose.connection.close();
    }).catch((err)=>{
        console.log(err);
    }).finally(()=>{
        mongoose.connection.close();
    })
}).catch(console.log)
