var mongoose = require("mongoose");

var Hashtag = mongoose.model("Hashtag", {
    tag : String,
    posts : [Post]  
});

var Reply = mongoose.model("Reply", {
    username : String,
    time : Date,
    message : String
});

var Post = mongoose.model("Post", {
    username : String,
    time : Date,
    message : String,
    replies : [String],
    hashtags : [String]
});

var createSuccess = function (data) {
	return {
		success : true,
		errorMessage : "",
		data : data
	};
}

var createError = function (errorMessage) {
	return {
		success : false,
		errorMessage : errorMessage,
		data : null
	};
}

var getHashTagsFromMessage = function (message) {
	var hashs = [];
	
	var words = message.split(" ");
	for (var i = 0; i < words.length; i++) {
		if(words[i][0] === "#"){
			hashs.push(words[i]);
		};
	};

	return hashs;
};

module.exports.deleteAll = function () {
	console.log("Deleteing all");
	Post.remove({}, function (err) {
		if(err) console.log(err);
	});
	Reply.remove({}, function (err) {
		if(err) console.log(err);
	});
	Hashtag.remove({}, function (err) {
		if(err) console.log(err);
	});
};

module.exports.addPost = function (username, message, callback) {
	if(username == "") {
		callback(createError("Username is required"));
		return;
	};
	
	if(message == "") {
		callback(createError("Message is required"));
		return;
	};
	
	var post = new Post();
	post.username = username;
	post.message = message;
	post.time = new Date();
	post.hashtags = getHashTagsFromMessage(message);

	Post.create(post, function (err, p) {
		if(err) return err;

		callback(createSuccess(p));		
	});	
};

module.exports.getPostById = function (id, callback) {
	Post.findOne({_id : id}, function (err, post) {
		if(err){
			callback(createError("Post '" + id + "' not found.\n" + err));
			return;
		};

		callback(createSuccess(post));
		return;
	});
};

module.exports.getPostsByHashTag = function (hashtag, callback) {
	Post.find({hashtags : hashtag}, function (err, posts) {
		if(err){
			callback(createError("No posts found for hashtag '" + hashtag + "'"));
			return;
		};

		callback(createSuccess(posts));
		return;
	});		
};

module.exports.getAllPosts = function (pageNumber, callback) {
	Post.find({})
		.limit(10)
		.skip(pageNumber)
		.sort({time: -1})
		.exec(function (err, posts) {
			if(err){
				callback(createError("Error when getting all posts (page '" + pageNumber + "'\n" + err))
			};

			callback(createSuccess(posts));
		});
};