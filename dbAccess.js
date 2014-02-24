var mongoose = require("mongoose");
var model = require("./model.js");
var Hashtag = model.Hashtag;
var Reply = model.Reply;
var Post = model.Post;

var createSuccess = function (data) {
	return {
		success : true,
		errorMessage : "",
		data : data
	};
};

var createError = function (errorMessage) {
	return {
		success : false,
		errorMessage : errorMessage,
		data : null
	};
};

var getHashTagsFromMessage = function (message) {
	var hashs = [];

	var words = message.split(" ");
	for (var i = 0; i < words.length; i++) {
		if(words[i][0] === "#"){
			hashs.push(words[i]);
		}
	}

	return hashs;
};

module.exports.addPost = function (username, message, callback) {
	if(username === "") {
		callback(createError("Username is required"));
		return;
	}

	if(message === "") {
		callback(createError("Message is required"));
		return;
	}

	var post = new Post();
	post.username = username;
	post.message = message;
	post.time = new Date();
	post.hashtags = getHashTagsFromMessage(message);

	Post.create(post, function (err, p) {
		if(err){
			callback(err);
			return;
		}

		callback(createSuccess(p));
	});
};

module.exports.getPostById = function (id, callback) {
	Post.findOne({_id : id}, function (err, post) {
		if(err){
			callback(createError("Post '" + id + "' not found.\n" + err));
			return;
		}

		callback(createSuccess(post));
		return;
	});
};

module.exports.getPostsByHashTag = function (hashtag, callback) {
	Post.find({hashtags : hashtag}, function (err, posts) {
		if(err){
			callback(createError("No posts found for hashtag '" + hashtag + "'"));
			return;
		}

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
				callback(createError("Error when getting all posts (page '" + pageNumber + "'\n" + err));
			}

			callback(createSuccess(posts));
		});
};

module.exports.addReply = function (id, username, message, callback) {

	if(username === "") {
		callback(createError("Username is required"));
		return;
	}

	if(message === "") {
		callback(createError("Message is required"));
		return;
	}

	var r = new Reply();
	r.parentPostId = id;
	r.username = username;
	r.message = message;
	r.time = new Date();

	Reply.create(r, function (err, reply) {
		if(err){
			callback(err);
			return;
		}

		Post.findByIdAndUpdate(
			id,
			{ $push : {replies : reply.message}},
			{ safe : true, upsert : true},
			function (err, post) {
				if(err){
					callback(err);
					return;
				}

				callback(createSuccess(reply));
		});
	});
};