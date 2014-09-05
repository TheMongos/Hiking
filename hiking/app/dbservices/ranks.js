


var Rank = require('../models/rank');
var User = require('../models/user');
var Hike = require('../models/hike');
var RankingPage = require('../models/ranking_page');

var ObjectID = require('mongoose').Types.ObjectId;

exports.addRank = function(req, res) {
	var hikeId = req.params.id;
	var username = req.session.username;
    getRank(hikeId, username, function(oldRankId, message) {
        res.render('addRank.ejs', {
            message : message
        });
    });
};

exports.saveRank = function(req, res) {
	var hikeId = req.params.id;
	var username = req.session.username;
	Hike.findById(hikeId, function(err, hike){
		saveNewRank(req, res, hike.name, hikeId , username,  function(rank) {
			if(rank) {
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


				getRankingPageId(hike, function(err, rankingPageId) {
					if(err){
						console.log(err);
						throw err;
					} 

					RankingPage.findByIdAndUpdate(rankingPageId, { $push: { "comments":  {rank_id: new ObjectID(rank._id), posted: rank.posted 
						, author : rank.username , overall_rating : rank.overall_rating , short_description : rank.description.substring(0, 20)}}}, function(err, rankingPage){
						if(err)
							console.log(err);
					});
				});

				User.findOneAndUpdate({ username: username }, { $push: { "rank_history": { rank_id: new ObjectID(rank._id), hike_id: new ObjectID(hike._id), 
					hike_name : hike.name , overall_rating: rank.overall_rating} } }, function(err, data){
					if(err)
						console.log("error3 "+ err);
				});
			}
	    });
	});

	req.method = 'get'; 
    res.redirect('/hikes/' + hikeId);
};

function getRankingPageId(hike, callback) {
	var rankingPageId;
	if(hike.ranking_pages.lenth > 0) {
		rankingPageId = hike.ranking_pages[hike.ranking_pages.length - 1];
		RankingPage.findById(rankingPageId, function(err, rankingPage){
			if (err) {
				console.log(err);
				throw err;
			}

			if( rankingPage.count >= 20 ) {
				addRankingPageToHike(hike, rankingPage.page, callback);
			}

		});
	} else {
		addRankingPageToHike(hike, 0, callback);
	}
}

function addRankingPageToHike(hike, page, callback) {
	var newPage = new RankingPage();
	newPage.hike_id = hike._id;
	newPage.page = page +1;
	newPage.count = 0;

	newPage.save(function(err, rankingPage) {
		if (err){
			callback(err);
		}

		Hike.findByIdAndUpdate(hike._id, { $push: { "ranking_pages":  rankingPage._id }}, function(err, hike){
			if (err) {
				callback(err);
			} else {
				callback(null, newPage._id)
			}
		});
	});
}

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
	console.log("username:" + username + " || " + "hikeId:" + hikeId);
    User.findOne( { username: username }, function(err, user) {
    	var foundMatch = false;
    	if(err) {
    		console.log("error2:" + err);
    		callback(null, "");
    	}

    	var rankArr = user.rank_history;
    	var hikeObjectId = new ObjectID(hikeId);
    	console.log(hikeObjectId);
    	for(var i in rankArr) {
    		if(rankArr[i].hike_id == hikeObjectId) {
    			callback(rankArr[i].rank_id, "You have already rank this hike, adding a new rank will delete your last rank");
    			console.log("here!!");
    			foundMatch = true;
    		}

    	}

    	if(!foundMatch) {
    		callback(null, "");
    	}
    });
}

