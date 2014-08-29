

var Hike = require('../models/hike');

exports.findAll = function(req, res) {
    getHikes(function(list) {
        if(list) {
            res.render('hikes.ejs', {
                hikesList : list
            });
        }
    });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    getHike(id, function(hike) {
        if(hike) {
            res.render('hike.ejs', {
                hikesList : hike
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
            res.render('hikes.ejs', {
                hikesList : list
            });
        } else {
            res.redirect('/hikes');
        }
    });

};

function getHike(id, callback) { 
    Hike.findById(id, function(error, hike){
        if (error) {
            callback(false);
        } else {
            callback(hike);
        }
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
    var point = { type : "Point", coordinates : [lon, lat] };
    var maxDistance = 50000 //in meters
    Hike.geoNear(point, { maxDistance : maxDistance , spherical : true }, function(err, results, stats) {
        if (err) {
            callback(false);
        } else {
            console.log(results);
            callback(results);
        }
    });
}