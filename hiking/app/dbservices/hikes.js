var Hike = require('../models/hike');
var User = require('../models/user');
var ObjectID = require('mongoose').Types.ObjectId;

exports.findAll = function(req, res) {
    getHikes(function(list) {
        if(list) {
            res.render('hikes.ejs', {
                hikesList : list,
                message : ''
            });
        }
    });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    getHike(id, function(err, hike) {
        if(hike) {
            
            res.render('hike.ejs', {
                hike : hike
            });
        } else {
            res.redirect('/hikes');
        }
    });
};

exports.getHikesNear = function(req, res) {
    var lon = req.params.lon;
    var lat = req.params.lat;

    findNear(lon, lat, function(list){
        if (list) {
            var results = [];
            for (var hike in list.results) {
                results.push(list.results[hike].obj);
            }
            res.render('hikes.ejs', {
                hikesList : results,
                message : ''
            });
        } else {
            res.redirect('/hikes');
        }
    });

};

exports.search = function(req, res) {
    var query = generateQuery(req); //Generate the dynamic query
    Hike.find(query, function(err, list) {
        if (err) {
            console.log(err);
            res.render('error.ejs', {
                message : 'Internal error.'
            });

            return;
        }
        
        var message = '';
        if (list.length == 0)
            message = 'לא נמצאו מסלולים מתאימים';
        
        res.render('hikes.ejs', {
            hikesList : list,
            message : message
        });
    });

};

exports.incCompleted = function(req) {
    var hikeId = req.params.id;
    var username = req.session.username;

    checkUserCompletedHike(hikeId, username, function(err, user) {
        if(err) {
            console.log(err);
            return;
        }
        
        if(user.hike_history.length == 0) {
            incCompleteCount(hikeId, function(err) {
                if (err) {
                    console.log(err);
                    return;
                }
            });
        }
    });
};

function checkUserCompletedHike(hikeId, username, callback) {
    User.findOne( { username : username}, {hike_history : { $elemMatch : { hike_id : hikeId } } }, function(err, user) {
                if (err) 
                        return callback(err);
                    else
                        return callback(null, user);
                } );
}

function incCompleteCount(hikeId, callback) {
    Hike.findByIdAndUpdate(hikeId, { $inc: { completed_count: 1 }}, function(err) {
        return callback(err);  
    });
}

function generateQuery(req) {
    var area    = req.body['select-area'];
    var minDiff = req.body['select-mindiff'];
    var maxDiff = req.body['select-maxdiff']; 
    var query;

    if (area.length > 0) {
        query = {
            "area" : area,
            "Difficulty" : {$gte : minDiff , $lte : maxDiff}
        }

    }   else {
        query = {
            "Difficulty" : {$gte : minDiff , $lte : maxDiff}
        }
    }
    
    return query;
}

function getHike(id, callback) { 
    Hike.findById(id, function(err, hike){
        if (err) return callback(err);
        callback(null, hike);
    });
}

function getHikes(callback) { 
    Hike.find({}, function(error, hikes){
        if (error) {
            callback(false);
        } else {
            callback(hikes);
        }
    });
}

function findNear(lon, lat, callback) {
    var point = { type : "Point", coordinates : [parseFloat(lon), parseFloat(lat)] };
    var maxDistance = 10000 //in meters
    Hike.db.db.command( { geoNear: "hikes", near: point, spherical: true, maxDistance: maxDistance },
        function(err, docs) {
            if (err) {
                console.log(err);
            } else {
                callback(docs);
            }
    });
}
