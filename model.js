var mongoose = require("mongoose");

var Hashtag = mongoose.model("Hashtag", {
    tag : String,
    posts : [Post]
});

var Reply = mongoose.model("Reply", {
    parentPostId : String,
    username : String,
    time : Date,
    message : String,
});

var Post = mongoose.model("Post", {
    username : String,
    time : Date,
    message : String,
    replies : [String],
    hashtags : [String]
});

module.exports.Post = Post;
module.exports.Reply = Reply;
module.exports.Hashtag = Hashtag;