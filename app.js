var express = require("express"),
	methodOverride = require("method-override"),
	app = express(),
	bodyParser = require("body-parser"),
	expressSanitizer = require("express-sanitizer"),
	mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/TusronBlogs", {
	useMongoClient: true
});

//APP Config
app.use(bodyParser.urlencoded({
	extended: true
}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());					//Express Sanitizer goes after body parser

//Mongoose/MODEL Config
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	Created: {
		type: Date,
		default: Date.now
	}
});

var Blog = mongoose.model("Blog", blogSchema);

//Data Entry using Mongo Manual
// Blog.create({
//   title:"Test Blog",
//   image:"http://www.xfmay.com/wp-content/uploads/2014/12/airbnb.001.jpg",
//   body:"Testing Blog"
// });

//Index Route
app.get("/", function(req, res) {
	res.redirect("/blogs");
});

app.get("/blogs", function(req, res) {
	Blog.find({}, function(err, blogs) {
		if (err) {
			console.log(err);
		} else {
			res.render("index", {
				blogs: blogs
			});
		}
	});
});

//New Route
app.get("/blogs/new",function(req,res){
	res.render("new");
});

//create Route
app.post("/blogs", function(req,res){
	//create blog
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			console.log(err);
			res.render("new");
		}else{
			res.redirect("/blogs");
		}
	});
});

//Show Page Route
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}else{
			res.render("show", {blog: foundBlog});
		}
	});
});

//Edit Route
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit", {blog: foundBlog});
		}
	});
});

//Update Route
app.put("/blogs/:id",function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//Delete Route
app.delete("/blogs/:id", function(req, res){
	//Destroy Blog
	Blog.findByIdAndRemove(req.params.id, function(err, deleteBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
});

app.listen(9091, 'localhost', function() {
	console.log("The Server has started on 9091");
});
