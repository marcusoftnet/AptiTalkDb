var mongoose = require("mongoose");
var should = require("should");
var dbAccess = require("../dbAccess");
var testHelpers = require("./testHelpers.js");


describe("Getting posts", function () {

	var addTestPost = function (username, message) {
		dbAccess.addPost(username, message, function (result) {
			testHelpers.validateOkResult(result);
			console.log("Post added");
		});
	};

	var addTestPosts = function (numberOfPosts) {
		for (var i = 0; i < numberOfPosts; i++) {
			addTestPost(testHelpers.USERNAME, testHelpers.MESSAGE + " " + i);	
		}
	};

	before(function (done) {
		dbAccess.deleteAll();
		done();
	});

	after(function (done) {
		//dbAccess.deleteAll();
		done();
	});


	describe("by id", function () {

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
			dbAccess.deleteAll();
			done();
		});

		it("gets all posts with a certain hashtag", function (done) {
			addTestPost(testHelpers.USERNAME, "#tjaaana 1");
			addTestPost(testHelpers.USERNAME, "#tjaaana 2");
			addTestPost(testHelpers.USERNAME, "#tjaaana 3");
			addTestPost(testHelpers.USERNAME, "#tjaaana 4");
			addTestPost(testHelpers.USERNAME, "#jora 5");

			dbAccess.getPostsByHashTag("#tjaaana", function (result) {
				testHelpers.validateOkResult(result);
				result.data.length.should.equal(4);
				result.data[0].message.should.containEql("1");
				result.data[1].message.should.containEql("2");
				result.data[2].message.should.containEql("3");
				result.data[3].message.should.containEql("4");
				done();
			});
		});
		it("gets all posts in pages", function (done) {
			addTestPosts(10);

			dbAccess.getAllPosts(1, function (result) {
				testHelpers.validateOkResult(result);

				result.data.length.should.equal(10);
				result.data[9].message.should.containEql("10");
				done();
			});
		});
	});
});