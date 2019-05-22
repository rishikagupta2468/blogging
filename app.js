var express=      require("express"),
methodOverride=   require("method-override"),
expressSanitizer= require("express-sanitizer"),
bodyParser=       require("body-parser"),
mongoose=         require("mongoose"),
app=              express();
mongoose.connect("mongodb://localhost:27017/restful_Blog_App",{useNewUrlParser: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema= new mongoose.Schema(
    {
        title: String,
        body: String,
        image: String,
        date: {type: Date, default: Date.now}
    });

var Blog = mongoose.model("Blog", blogSchema);
//RESTful ROUTES
Blog.create({
   title:"first post",
   body:"camping picture",
   image:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
});
// home
app.get("/",function(req,res){
    res.redirect("/blogs");
});
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("error in finding");
        }else{
             res.render("index",{blogs:blogs});     
        }
    });
});
// new post
app.get("/blogs/new",function(req,res){
    res.render("new");
});
// create post
app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});
// show 
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,found){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:found});
        }
    });
});
// edit
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,found){
       if(err){
           res.redirect("/blogs");
       }else{
           res.render("edit",{blog:found});
       }
    });
});
// update
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,found){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("process is running");
});