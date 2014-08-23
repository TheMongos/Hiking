

var mongo = require("mongodb");
var dbHost = "127.0.0.1";   
var dbPort = mongo.Connection.DEFAULT_PORT;



exports.findByUsername = function(req, res) {
    var username = req.params.username;
    console.log('Retrieving student: ' + username);
    getUser(username, function(user){
        if (!user) {
            res.send("User does not exist", 404);
        } else {
            res.send(user);
        }
    });
};

exports.findAll = function(req, res) {
    console.log("findAll");
    getUsers(function(users){
    	console.log("We have the collection");
        if (!users) {
            res.send("There no users exist", 404);
        } else {
            res.send(users);
        }
    });
 
};

function getUser(username, callback) { 

    var db = new mongo.Db("Hiking", new mongo.Server(dbHost, dbPort, {}));
    db.open(function(error){
        console.log("We are connected! " + dbHost + ":" + dbPort);

        db.collection("users", function(error, collection){
            // console.log("We have the collection");
            collection.find({"username":username.toString()}, function(error, cursor){
                cursor.toArray(function(error, users){
                    if (users.length == 0) {
                        callback(false);
                    } else {
                        callback(users[0]);
                    }
                });
            });
        });

    });

}

function getUsers(callback) { 

    var db = new mongo.Db("Hiking", new mongo.Server(dbHost, dbPort, {}));
    db.open(function(error){
        console.log("We are connected! " + dbHost + ":" + dbPort);

        db.collection("users", function(error, collection){
            // console.log("We have the collection");
            collection.find({}, function(error, cursor){
                cursor.toArray(function(error, users){
                    if (users.length == 0) {
                        callback(false);
                    } else {
                        callback(users);
                    }
                });
            });
        });

    });
}