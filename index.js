var rectangle = require("./rectangle");
function solve(l,b){
    rectangle(l,b,(err,rect)=>{
        if(err){
            console.log(err.message);
        }
        else{
            console.log(rect.perimeter());
            console.log(rect.area());
        }
    })
    console.log("fff");
}

solve(0,1);
solve(1,1);



