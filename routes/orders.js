/*eslint-env node */
/*globals cloudantService */
//var cloudant = require('cloudant')(cloudantService.credentials.url);

var cloudantServiceCredentialsURL = "https://7a9141ed-e832-4800-9d6c-9b89fdfcf6f4-bluemix:0819c0128e5dbb3957f1373e2cf1758736ab00736b54146cd0b673b5e2324cea@7a9141ed-e832-4800-9d6c-9b89fdfcf6f4-bluemix.cloudant.com";
var cloudant = require('cloudant')(cloudantServiceCredentialsURL);

console.log('Cloudant URL', cloudantServiceCredentialsURL);


//Initiate the database.
cloudant.db.create('orders', function(err/*, body*/) {
    if (!err) {
        console.log('Successfully created database!');
    } else {
        console.log("Database already exists.");
    }
 });

var ordersDb = cloudant.use('orders');

/* add an order to the database */
exports.create = function(req, res) {
	ordersDb.insert(req.body, function(err/*, body, header*/) {
		if (err){
			res.status(500).send({msg: 'Error on insert, maybe the item already exists: ' + err});
		} else {
			res.status(201).send({msg: 'Successfully created item'});
		}
	});
};
    

/* find an order by id */
exports.find = function(req, res) {
	var id = req.params.id;
    ordersDb.get(id, { revs_info: false }, function(err, body) {
        if (!err) {
            res.send(body);
        } else {
            res.send({msg:'Error: could not find item: ' + id});
        }
    });	
};

/* list all orders */
exports.list = function(req, res) {
	ordersDb.list({include_docs: true}, function(err, body/*, headers*/) {
  		if (err) {
    		// something went wrong!
			res.status(500).send({msg: "'list' failed: " + err});			
  		} else {
			var result = "";
			if (!body.rows) {
				result = "No orders logged";
			} else {
		    	body.rows.forEach(function(doc) {
		      		result += JSON.stringify(doc).toLocaleLowerCase() + "<p>";
		    	});
		    }
		    res.send(result);
  		}
	});
};
