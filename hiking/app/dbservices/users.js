var User = require('../models/user');
var Hike = require('../models/hike');
var hikes = require('../dbservices/hikes'); 

var ObjectID    = require('mongoose').Types.ObjectId;

exports.logHike = function(req, res) {
    hikes.incCompleted(req);

    var hikeId = req.params.id;
    var username = req.session.username;
    var time = req.body.time;
    var distance = req.body.distance;

    Hike.findById(hikeId, function(err,hike){
        if(err){
            console.log(err);
            res.render('error.ejs', {
                message : 'Internal error.'
            });
            return;
        }
        
        User.findOneAndUpdate( { username : username }, { $push : { hike_history : { hike_id: new ObjectID(hike._id) ,
         hike_name: hike.name , hike_data : { distance: distance , time : time}}}}, function(err, data){
            if(err){
                console.log(err);
                res.render('error.ejs', {
                    message : 'Internal error.'
                });
                return;
            }

            res.redirect('/profile');
         });

    });

};
