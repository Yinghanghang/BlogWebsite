//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const homeStartingContent = "Welcome to the blog website. Begin crafting your first post.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const MONGODB_USERNAME = process.env.MONGODB_USERNAME
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const url = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.jnbvouk.mongodb.net/blogtDB`;
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
  Post.find({})
  .then(foundPosts => {
    res.render("home.ejs", {
      homeContent: homeStartingContent,
      posts: foundPosts
    });
  })
  .catch(error => {
    console.error("Error:", error);
  });
});

app.get("/about", (req, res) => {
  res.render("about.ejs", {
    aboutContent: aboutContent
  });
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs", {
    contactContent: contactContent
  });
});

app.get("/compose", (req, res) => {
  res.render("compose.ejs", {

  });
});

app.post("/compose", async function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postContent
  });

  try{
    await post.save();
    res.redirect("/");
  }catch(error){
    console.error("Error:", error);
    res.status(500).send("An error occurred.");
  }

});

app.get("/posts/:postId", (req, res) => {
  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId})
  .then(foundPost => {
    res.render("post.ejs", {
      post: foundPost
    })
  }).catch(error => {
    console.error("Error:", error);
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
