var express = require("express");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/scraped_news");
var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    console.log("Connected to Mongoose!");
});

app.get("/scrape", function(req, res) {
 axios.get("https://www.economist.com/").then(function(response) {
   var $ = cheerio.load(html);

    $("story").each(function(i, element) {
        var storyTitle = $(element).find(".story-title.heading").children("a").first().text();
        var storyDate = $(element).find(".author-date.visible-sm-block").children("span.timestamp").first().text();
      var storyLink = $(element).find(".story-title.heading").children("a").first().attr("href");
      var para1 = $(element).find(".story-intro").find("p").first().text();
  
      var newArticle = new Article({
          title: storyTitle,
           date: storyDate,
           link: "https://www.economist.com/" + storyLink,
           story: para1
      });
    //   var result = {};

    //  result.title = $(this)
    //     .children("a")
    //     .text();
    //   result.link = $(this)
    //     .children("a")
    //     .attr("href");

    //   db.Article.create(result)
    //     .then(function(dbArticle) {
    //      console.log(dbArticle);
    //     })
    //     .catch(function(err) {
    //      console.log(err);
    //     });
    });

   res.send("Scrape Complete");
  });
});

app.get("/articles", function(req, res) {
 db.Article.find({})
    .then(function(dbArticle) {
     res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
   .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
