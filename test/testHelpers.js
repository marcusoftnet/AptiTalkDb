var mongoose = require("mongoose");
var should = require("should");

module.exports.USERNAME = "Marcus";
module.exports.MESSAGE = "Tjaaaana!";

module.exports.connectMongo = function () {
	mongoose.connect("mongodb://localhost:27017/AptiTalk_Test");
};

module.exports.validateErrorResult = function (result, errorMessage) {
	should.exists(result);
	should.exists(result.success);		
	result.success.should.be.false;
	should.exists(result.errorMessage);
	result.errorMessage.should.startWith(errorMessage);
	should.not.exists(result.data);
};

module.exports.validateOkResult = function (result) {
	should.exists(result);
	should.exists(result.success);
	result.success.should.be.true;
	should.exists(result.errorMessage);
	result.errorMessage.should.be.empty;
	should.exists(result.data);	
};