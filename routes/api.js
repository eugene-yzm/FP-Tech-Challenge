/*
 * Serve JSON to our AngularJS client
 */
var express     = require('express');
var https       = require('https');
var q           = require('q');
var api         = express.Router();
var db          = require('../config/db').connection;
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

// API endpoint for /api/apparel
api.get('/api/apparel', function(req, res) {
	// Route for getting all shirts
	if(req.query.all!=null){
		db.query('SELECT * FROM apparel', function(err, rows, fields){ 
			if (err){			
				res.status(500).send('Something broke!');
			};
			console.log(rows);
			res.json(rows);
		});
	};
//	else if(req.query.id){
//		db.query('SELECT * FROM apparel', function(err, rows, fields){ 
//			console.log(rows);
//		});

});

// API endpoint for /api/quote
api.post('/api/quote', function(req, res) {
	// Insert Quoting API code here
	console.log("Quote requested");
	console.log(req.body);
	var b;
	a = getApparelPrice(req.body.style_codes, req.body.color_codes,req.body.size_codes).then(function (err, req, response, next) {
		if(!err){
			b= response;
			res.send(b);
		if (err){			
		}
			res.status(500).send('Something broke!');
		};
	});
});

// Function for making an Inventory API call
var getApparelPrice = function getPrice(style_code, color_code, size_code) {
	var	apparelPriceDeferred = q.defer();

	// Format the Inventory API endpoint as explained in the documentation
	var usr = 'triggered1111';
	var pw = 'triggered2222';
	var pr = 'y';
	var zp = 10002;
	var url = 'https://www.alphashirt.com/cgi-bin/online/xml/inv-request.w?sr='+style_code+'&cc='+color_code+'&sc='+size_code+'&pr='+pr+'&zp='+zp+'&userName='+usr+'&password='+pw;
	console.log(url);
	var output = '';
	
	https.get(url, function(res) {
		res.on('data', function (data) {output += data.toString();});
		res.on('end', function() {
		parser.parseString(output, function(err, result) {
			j=JSON.parse(JSON.stringify(result));
			item = j['inv-balance']['item']
			p=item[0]['$']['price']
			console.log(p);
			
		    apparelPriceDeferred.resolve(p);
         });
		});
	}).on('error', function(error) {
		// Handle EDI call errors here	
	});

	return apparelPriceDeferred.promise;
}

module.exports = api;