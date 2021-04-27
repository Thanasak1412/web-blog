const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lorem ipsum dolor sit amet, consectet";
const contactContent = "Lorem ipsum dolor sit";
const aboutContent = "Lorem ipsum dolor";

const app = express();

mongoose.connect("mongodb://localhost:27017/web-blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = mongoose.Schema({
  title: {
    type: String,
    min: 1,
  },
  content: {
    type: String,
    min: 1,
  },
});

const Post = mongoose.model("Post", postSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) {
      console.log(err);
    } else {
      res.render("home", { startContent: homeStartingContent, posts: posts });
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about", { content: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { content: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const post = new Post({
    title: req.body.inputTitle,
    content: req.body.inputContent,
  });

  post.save((err) => {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", (req, res) => {
  const { postId } = req.params;

  Post.findOne({ _id: postId }, (err, { title, content }) => {
    if (!err) {
      res.render("post", { title: title, content: content });
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
