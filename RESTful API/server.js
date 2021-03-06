//BASE SETUP
//==================================================

//call the packages we need
var express = require('express');		//call express
var app = express();					//define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Bear = require('./app/models/bear');

mongoose.connect('mongodb://startup:password@proximus.modulusmongo.net:27017/Q2imuqeb'); // connect to our database

//configure app to use bodyParser()
//this will let us get the data from POST
app.use(bodyParser());

var port = process.env.PORT || 8080;	//set our port

//ROUTES FOR OUR API
//===================================================
var router = express.Router();			//get an instance of the express router

//middleware to use for all requests
router.use(function(req, res, next){
	//do logging
	console.log('Something is happening.');
	next();
});

//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res){
	res.json({message:'hooray! welcome to our api!'});
});

//more routes for our API will happen here

//on routes that end in /bears
//-----------------------------------------------------
router.route('/bears')

	//create a bear(accessed at POST http://localhost:8080/api/bears)
	.post(function(req,res){
		var bear = new Bear(); //create a new instance of Bear Model
		bear.name=req.body.name; //set the bears name (comes from the request)

		//save the bear and check for errors
		bear.save(function(err){
			if(err)
				res.send(err);

			res.json({message: 'Bear created!'});
		});

	})

	//get all the bears(accessed at GET http://localhost:8080/api/bears)
	.get(function(req,res){
		Bear.find(function(err,bears){
			if(err)
				res.send(err);

			res.json(bears);
		});
	});
// on routes that end in /bears/:bear_id
//-----------------------------------------------------
router.route('/bears/:bear_id')

	//get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
	.get(function(req,res){
		Bear.findById(req.params.bear_id,function(err,bear){
			if(err)
				res.send(err);
			res.json(bear);
		});
	})

	//update the bear with thi id(accessed at put http://localhost:8080/api/bears/:bear_id)
	.put(function(req,res){
		Bear.findById(req.params.bear_id, function(res,bear){
			if(err)
				res.send(err);

			bear.name=req.body.name; // update the bear name

			//save the bear
			bear.save(function(err){
				if(err)
					res.send(err);
				res.json({message: 'Bear updated'});
			});
		});
	});

//REGISTER OUR ROUTES----------------------------------
//all of our routes will be prefixed with /api
app.use('/api',router);

//START THE SERVER
//=====================================================
app.listen(port);
console.log('Magic happens on port '+ port);