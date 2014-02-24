var mongoose = require("mongoose");
var should = require("should");
var dbAccess = require("../dbAccess");
var testHelpers = require("./testHelpers.js");


describe("Getting posts", function () {

	var addTestPost = function (username, message, cb) {
		dbAccess.addPost(username, message, function (result) {
			testHelpers.validateOkResult(result);
			cb(result);
		});
	};

	var addTestPosts = function (numberOfPosts, callback) {
		for (var i = 0; i <= numberOfPosts; i++) {
			addTestPost(testHelpers.USERNAME, testHelpers.MESSAGE + " " + (i + 1), callback);
		}
	};

	after(function (done) {
		testHelpers.deleteAll();
		done();
	});


	describe("by id", function () {

		beforeEach(function (done) {
			testHelpers.deleteAll();
			done();
		});

		it("gets a post by id", function (done) {
			dbAccess.addPost(testHelpers.USERNAME, testHelpers.MESSAGE, function (result) {
				var id = result.data._id;

				var postFromDb = dbAccess.getPostById(id, function (result) {
					testHelpers.validateOkResult(result);
					result.data.username.should.equal(testHelpers.USERNAME);
					result.data.message.should.equal(testHelpers.MESSAGE);
					done();
				});
			});
		});
		it("returns an error for nonexisting id", function (done) {
			dbAccess.getPostById(123, function (result) {
				testHelpers.validateErrorResult(result, "Post '123' not found");
				done();
			});
		});
	});

	describe("by other properties", function () {
		beforeEach(function (done) {
			testHelpers.deleteAll();
			done();
		});

		// Needs promises... badly...
		// https://twitter.com/ullmark/statuses/437932230091243520
		it("gets all posts with a certain hashtag", function (done) {
			addTestPost(testHelpers.USERNAME, "#tjaaana 1", function (result) {
				addTestPost(testHelpers.USERNAME, "#tjaaana 2", function (result) {
					addTestPost(testHelpers.USERNAME, "#tjaaana 3", function (result) {
						addTestPost(testHelpers.USERNAME, "#tjaaana 4", function (result) {
							addTestPost(testHelpers.USERNAME, "#jora 4", function (result) {
								dbAccess.getPostsByHashTag("#tjaaana", function (result) {
									result.data.length.should.equal(4);
									done();
								});
							});
						});
					});
				});
			});
		});
		it("gets all posts in pages", function (done) {
			addTestPosts(12, function (result) {
				dbAccess.getAllPosts(1, function (result) {
					testHelpers.validateOkResult(result);
					result.data.length.should.equal(10);
				});
			});
			done();
		});
	});
});