


var Rank = require('../models/rank');
var User = require('../models/user');
var Hike = require('../models/hike');
var RankingPage = require('../models/ranking_page');

var ObjectID = require('mongoose').Schema.Types.ObjectId;

exports.addRank = function(req, res) {
	hikeId = req.params.id;
	username = req.session.username;
    getRank(hikeId, username, function(oldRankId, message) {
        res.render('addRank.ejs', {
            message : message
        });
    });
};

exports.saveRank = function(req, res) {
	hikeId = req.params.id;
	username = req.session.username;
	var hike = Hike.findById(hikeId);
	saveNewRank(req, res, hike.name, hikeId , username,  function(err, rank) {
		if(rank) {
			console.log(rank);
			getRank(hikeId, username, function(oldRankId, message) {
				if(oldRankId) { 
					RankingPage.update({},{ $pull: { comments: { rank_id: oldRankId } } }, { multi: false });
					User.update({ username: username }, { $pull: { rank_history: { rank_id: oldRankId } } }, { multi: false });
					var oldRank = Rank.findById(oldRankId);
					var hikeRankCount = hike.rank_count;
					var hikeAvgRating = hike.avg_overall_rating * hikeRankCount;
					hikeRankCount = hikeRankCount -1 ;
					hikeAvgRating -= oldRank.overall_rating;
					Hike.update({_id : hike._id},{avg_overall_rating : hikeAvgRating, rank_count : hikeRankCount}, { multi: false });

				}
			});


			User.update({ username: username }, { $push: { rank_history: { rank_id: rank._id , hike_id: hikeId, hike_name : hike.name , overall_rating: rank.overall_rating} } }, { multi: false });
		}
    });

    res.redirect()
};


function saveNewRank(req, res, hikeName, hikeId, username, callback) {
	var newRank 			= new Rank();
	newRank.username 		= username;
	newRank.hike_id 		= hikeId;
	newRank.hike_name 		= hikeName;	
	newRank.overall_rating 	= req.body.overall_rating;
	newRank.difficulty		= req.body.difficulty;
	newRank.cleanliness		= req.body.cleanliness;
	newRank.description		= req.body.description;
	
	newRank.save(function(err) {
	if (err){
		console.log("error!!!");
		throw err;
	}
		callback(newRank);
	});
}

function getRank(hikeId, username, callback) { 
    User.findOne( { username: username }, function(err, user) {
    	var foundMatch = false;
    	if(err) {
    		console.log(err);
    		callback("");
    	}

    	var rankArr = user.rank_history;
    	var hikeObjectId = new ObjectID(hikeId);
    	console.log(hikeObjectId);
    	for(var i in rankArr) {
    		if(rankArr[i].hike_id == hikeObjectId) {
    			callback(rankArr[i].rank_id, "You have already rank this hike, adding a new rank will delete your last rank");
    			foundMatch = true;
    		}

    	}

    	if(!foundMatch) {
    		callback(null, "");
    	}
    });
}

