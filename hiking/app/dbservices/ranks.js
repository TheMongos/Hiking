


var Rank = require('../models/rank');

exports.addRank = function(req, res) {
    getRank(function(message) {
        if(list) {
            res.render('hikes.ejs', {
                hikesList : list
            });
        }
    });
};

function getRank(hikeId, username, callback) { 
    Rank.findById(id, function(error, hike){
        if (error) {
            callback(false);
        } else {
            callback(hike);
        }
    });
}

