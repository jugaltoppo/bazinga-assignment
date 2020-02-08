var express = require("express");
var app = express();
var mongoose = require("mongoose");
var methodOverride = require("method-override");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


console.log(process.env.MONGOURL)
var url=process.env.MONGOURL;
mongoose.connect(url);

app.set("view engine","ejs");


app.use(express.urlencoded({extended : true}));
app.use(express.json());
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
    Data.findByIdAndUpdate(req.params.id, req.body.order, function(err, updated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/bazinga/" + req.params.id);
        }
    });
});

//webhook handler
app.post("/", function(req, res){
    var data=req.body;
    console.log(data)
    Data.create(data, function(err, dataCreated){
        if(err){
            console.log("error");
        }else{
            res.send("success");
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