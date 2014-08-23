

var mongo = require("mongodb");
var dbHost = "127.0.0.1";   
var dbPort = mongo.Connection.DEFAULT_PORT;
var ObjectID = require('mongodb').ObjectID;

exports.findAll = function(req, res) {
    console.log("findAllhikes");
    getHikes(function(hikes){
        if (!hikes) {
            res.send("There no hikes exist", 404);
        } else {
            console.log(hikes);
            res.send(hikes);
        }
    });
 
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving student: ' + id);
    getHike(id, function(hike){
        if (!hike) {
            res.send("hike does not exist", 404);
        } else {
            res.send(hike);
        }
    });
};

function getHike(id, callback) { 

    var db = new mongo.Db("Hiking", new mongo.Server(dbHost, dbPort, {}));
    db.open(function(error){
        console.log("We are connected! " + dbHost + ":" + dbPort);
		var o_id = new ObjectID(id);
        db.collection("hikes", function(error, collection){
            collection.find({"_id":o_id}, function(error, cursor){
                cursor.toArray(function(error, hikes){
                    if (hikes.length == 0) {
                    	console.log("here!!!!");
                        callback(false);
                    } else {
                        callback(hikes[0]);
                    }
                });
            });
        });

    });

}

function getHikes(callback) { 

    var db = new mongo.Db("Hiking", new mongo.Server(dbHost, dbPort, {}));
    db.open(function(error){
        console.log("We are connected! " + dbHost + ":" + dbPort);

        db.collection("hikes", function(error, collection){
            // console.log("We have the collection");
            collection.find({}, function(error, cursor){
                cursor.toArray(function(error, hikes){
                    if (hikes.length == 0) {
                        callback(false);
                    } else {
                        callback(hikes);
                    }
                });
            });
        });
    });
}