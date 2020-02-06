var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// mongodb+srv://bazinga:bazinga@cluster0-kebuy.mongodb.net/test?retryWrites=true&w=majority
console.log(process.env.MONGOURL)
var url=process.env.MONGOURL;
mongoose.connect(url);

app.set("view engine","ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

var dataSchema = new mongoose.Schema({
    email: String,
    name: String,
    number: String,
    total_price_usd: String,
    user_id: String,
    phone: String,
    order_number: String
});
var Data = mongoose.model("Data", dataSchema);

// Data.create({name: { first: "jugal", last: "sekhar"}, age: 22}, function(err, data){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(data + " created")
//     }
// });

//index
app.get("/", function(req, res){
    res.redirect("/bazinga");
});

app.get("/bazinga", function(req, res){
    Data.find({},function(err, indexData){
        if(err){
            console.log(err);
        }else{
            // console.log(indexData)
            res.render("home", {data: indexData});
        }
    })
});

//show
app.get("/bazinga/:id", function(req, res){
    Data.findById(req.params.id, function(err, showData){
        if(err){
            console.log(err);
        }else{
            res.render("show", {showData: showData});
        }
    });
})

//edit
app.get("/bazinga/:id/edit", function(req, res){
    Data.findById(req.params.id, function(err, founddata){
        if(err){
            console.log(err);
        }else{
            res.render("edit", {data: founddata})
        }
    });
});

//update
app.put("/bazinga/:id", function(req, res){
    // console.log(req.body.email);
    Data.findByIdAndUpdate(req.params.id, req.body.order, function(err, updated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/bazinga/" + req.params.id);
        }
    });
});

app.post("/bazinga/webhook", function(req, res){
    var data= req.body;
    // console.log(data)
    Data.create(data, function(err, dataCreated){
        if(err){
            console.log("error");
        }else{
            // res.render("bazingadata.ejs", {data: dataCreated})
        }
    });
});




var port=process.env.PORT;
if(port==null || port==""){
    port=3000;
}
app.listen(port, function(){
    console.log("listening to port " + port);
});