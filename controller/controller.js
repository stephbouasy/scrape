var express = require("express");
var router = express.Router();
var path = require("path");

var request = require("request");
var cheerio = require("cheerio");

var article = require("../models/article.js");

router.get("/", function(req, res) {
    request("http://www.theeconomist.com", function(error, response, html) {
        var $ = cheerio.load(html);
        var titleArray = [];

        $(".c-entry-box--compact_title").each(function(i, element) {
            var result{};

            result.title = $(this)
            .children("a")
            .text();
            result.link = $(this)
            .children("a")
            .attr("href");

            if(result.title !== "" && result.link !==""){

                if (titlesArray.indexOf(result.title) == -1) {
                    article.count({ title: result.title }, function(err, test){
                        if (test === 0) {
                            var etry = new article(result);
                            IntersectionObserverEntry.save(function(err, doc){
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(doc);
                                }
                            })
                        }
                    })
                } else {
                    console.log("Article already exists.");
                }
            } else {
                console.log("Not saved to DB, missing data");
            } 
        });
        res.redirect("/");
    });
});
router.get("/articles", function(req,res) {
    article.find().sort({ _id: -1}).exec(function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            var artc1 = { article: doc };
            res.render("index", artc1);
        }
    });
});

router.get("/articles-json", function(req, res) {
    article.find({}, function(err, doc){
        if (err){
            console.log(err);
        }else {
            res.json(doc);
        }
    });
});

router.get("/clearAll", function(req, res) {
    article.remove{{}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log("removed all articles");
        }
    }};
    res.redirect("/articles-json");
});

router.get("/readArticle/:id", function(req, res) {
    var articleId = req.params.id;
    var hbsObj = {
        article: [],
        body: []
    };

    article.findOne{( _id: articleId )}
    .populate("comment")
    .exec(function(err, doc) {
        if (err) {
            console.log("Error: " + err);
        } else {
            hbsObj.article = doc;
            var link = doc.link;
            request(link, function(error, response, html) {

                $(".1-col_main").each(function(i, element) {
                    hbsObj.body = $(this)
                    .children(".c-entry-content")
                    .children("p")
                    .text();

                    res.render("article", hbsObj);
                    return false;
                }));
            });
        }
    });
});

router.post("/comment/:id", function(req, res) {
    var user = req.body.name;
    var content = req.body.comment;
    var articleId = req.params.id;

    var commentObj = {
        name: user,
        body: content
    };
})

module.exports = router;