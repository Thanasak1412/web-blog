const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cum repellat delectus esse in optio, voluptatibus vitae. Iusto aspernatur incidunt maiores pariatur laborum ipsam, eum architecto obcaecati est explicabo delectus possimus!";
const contactContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima earum quo, quibusdam voluptatem tempore quisquam. A consectetur non minus ab quam nihil qui. Atque adipisci quasi voluptatum cumque veritatis natus?";
const aboutContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae odit est minus nisi, accusamus asperiores magnam, eligendi praesentium neque aliquid nulla itaque alias fugit pariatur repudiandae, illum delectus aut. Quis?";
let posts = [];

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home", { startContent: homeStartingContent, posts: posts });
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

app.get("/posts/:title", (req, res) => {
  posts.forEach(({title, content}) => {
    const reqTitle = _.lowerCase(req.params.title);

    if (reqTitle === _.lowerCase(title)) {
      res.render("post", { title: title, content: content });
    } else {
      res.render("post", { title: "404 Not Found", content: "" });
    }
  })
})

app.post("/compose", (req, res) => {
  const post = {
    title: req.body.inputTitle,
    content: req.body.inputContent
  }
  posts.push(post);
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});