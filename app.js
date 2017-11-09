var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
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

app.listen(9091, 'localhost', function() {
	console.log("The Server has started on 9091");
});
