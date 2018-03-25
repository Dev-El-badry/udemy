'use strict';

module.exports = function(Member) {

	Member.sayMyName = function(firstName, callback) {
		//var myResponse = 'my name is '+myName;

		callback(null, firstName);
	};

	Member.beforeRemote('sayMyName', function (context, unused, next) {
		var args = context.args.firstName;
		console.log("firstname is : "+args);
		next();
	});

	Member.afterRemote('sayMyName', function(context, finalOutput, next) {
		context.result.firstName = "ahmed";
		context.result.lastName = "elbadry";
		console.log('this is after remot hook running.');
		next();
	});

	function updateOthersCollection(collectionNames, whereCondition, newData) {
		var app = require('../../server/server');
		var db = app.dataSources.db;
		var collection = db.connector.collection(collectionNames);

		collection.update(
			whereCondition,
			{
				$set: 
				newData
			},
			{ multi: true }
		);
	}

	Member.observe('after save', function(context, next) {
		
		if((context.isNewInstance === undefined) && (context.info.count >0)) {
			console.log('You need to do more update operations');
			
			var whereCondition = context.where;
			var newData = context.data;
			updateOthersCollection('Comment', whereCondition, newData);
			console.log('All As Well');
		}

		next();
	});

};
