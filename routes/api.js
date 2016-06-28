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
	var resp;
	a = getApparelPrice(req.body.style_code, req.body.color_code,req.body.size_code);
	a.then(
	function(response){
			var cost_object = {};
			var num = Number(req.body.amount);
			var weight = req.body.weight;
			var resp = response;
			var price = Number(resp.split('$')[1]);
			var bare_total = price*num;
			var markup = 0;
			var grand_total = 0;
			var shipping;
			if (weight<=0.4){
				shipping = num* (1*(num<48)+0.75*(num>=48));				
			}
			else if(weight>0.4){
				shipping = num* (0.5*(num<48)+0.25*(num>=48));
			}
			var salesman = (bare_total+ shipping)*0.07 //Salesman markup
			var total_order_cost = (bare_total+ shipping) + salesman
			markup = total_order_cost * (0.50*(total_order_cost<800)+ 0.45*(total_order_cost>=800))
			grand_total = total_order_cost + markup;
			
			console.log('Bare total: ',bare_total);
			console.log('Shipping: ',shipping);
			console.log('Salesman comp:' ,salesman);
			console.log('Markup:' ,markup);
			console.log('Grand_total:' ,grand_total);
			
			cost_object.bare_total=bare_total;
			cost_object.shipping=shipping;
			cost_object.salesman=salesman;
			cost_object.markup=markup;
			cost_object.grand_total=grand_total;
			res.send(cost_object);
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
	var p = 0;
	https.get(url, function(res) {
		res.on('data', function (data) {output += data.toString();});
		res.on('end', function() {
		parser.parseString(output, function(err, result) {
			j=JSON.parse(JSON.stringify(result));
			item = j['inv-balance']['item']
			p=item[0]['$']['price']
			console.log('Unit price: ', p);    
			apparelPriceDeferred.resolve(p);
		});
		});
	}).on('error', function(error) {
		// Handle EDI call errors here	
	});

	return apparelPriceDeferred.promise;
}

module.exports = api;