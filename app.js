var bodyParser = require("body-parser"),
    mongoose  = require("mongoose"),
    express  = require("express"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    app     = express();




mongoose.connect(process.env.DATABASEURL,{
    useNewUrlParser:true, 
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to DB!");
}).catch(err => {
    console.log('Error:',err.message);
});
app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var blog = mongoose.model("Blog",blogSchema); 

/*blog.create({
    title: "Test Blog",
    image: "https://unsplash.com/photos/INnZ8xG0ZHI",
    body: "This is for Blog"

});
*/

app.get("/",function(req,res){
    res.redirect("/blogs");
});
//Find Route
app.get("/blogs",function(req,res){
    blog.find({}, function(err,blogs){
        if(err){
            console.log("ERROR");
        }else{
            res.render("index",{blogs:blogs});
        }
    });
    
});
//New Route
app.get("/blogs/new",function(req,res){
   res.render("new");
    
});
//Create Route

app.post("/blogs",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.create(req.body.blog, function(err,newBlog){
        if(err){
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }

    })
})

//Show Route

app.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id,function(err,foundBlogs){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blog:foundBlogs});
        }
    })
});

//Edit Route

app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id,function(err,foundBlogs){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog:foundBlogs});
        }
    })
    
});

//Update Route




app.put("/blogs/:id",function(req,res){
    blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err,foundBlogs){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+ req.params.id);
        }
    })
    
});

// Delete Route
app.delete("/blogs/:id",function(req,res){
   // req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    })
})
app.listen(process.env.PORT, '0.0.0.0');