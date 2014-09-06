var Rank = require('../models/rank');
var User = require('../models/user');
var Hike = require('../models/hike');
var RankingPage = require('../models/ranking_page');

var ObjectID 	= require('mongoose').Types.ObjectId;
var async 		= require('async');

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
	console.log(req.params);
	var hikeId = req.params.id;
	var username = req.session.username;
	Hike.findById(hikeId, function(err, hike){
		saveNewRank(req, res, hike.name, hikeId , username,  function(rank) {
			if(rank) {
				getRank(hikeId, username, function(oldRankId, message) {
					if(oldRankId) { 
						RankingPage.update({},{ $pull: { comments: { rank_id: new ObjectID(oldRankId) } } }, { multi: false }, function(err){});
						User.update({ username: username }, { $pull: { rank_history: { rank_id: new ObjectID(oldRankId) } } }, { multi: false }, function(err){});
						Rank.findById(oldRankId, function(err, oldRank) { 
							var hikeRankCount = hike.rank_count;
							var hikeAvgRating = hike.avg_overall_rating * hikeRankCount;
							hikeRankCount = hikeRankCount -1 ;
							hikeAvgRating -= oldRank.overall_rating;
							if(hikeRankCount != 0 ) {
								hikeAvgRating =hikeAvgRating / hikeRankCount;
							}
							Hike.findByIdAndUpdate(hike._id ,{ $set: { avg_overall_rating : hikeAvgRating, rank_count : hikeRankCount} }, function(err, hike) {
								if(err) {  
									console.log(err); 
									throw err;
								}

								updateHikeAvg(hike, rank);
							});
						});
					} else {
						updateHikeAvg(hike, rank);
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
						console.log(err);
				});
			}
	    });
	});

	req.method = 'get'; 
    res.redirect('/hikes/' + hikeId);
};

exports.getRankingPage = function(req, res) {
	var hikeId 	= req.params.id;
	var pageNum = req.params.number;

	RankingPage.find( { hike_id : new ObjectID(hikeId) , page : pageNum }, function(err, rankingPage) {
	    if (err) {
            console.log(err);
            res.render('error.ejs', {
                message : 'Internal error.'
            });
        }
        
        var message = '';
        if (rankingPage.length == 0)
            message = 'לא קיים דף דירוג.';
        
        res.render('rankingPage.ejs', {
            rankPage : rankingPage[0],
            message : message
        });
	});


};


function updateHikeAvg(hike, rank) {
	Hike.findById(hike._id, function(err, newHike) {
		var hikeRankCount = newHike.rank_count;
		var hikeAvgRating = newHike.avg_overall_rating * hikeRankCount;
		hikeAvgRating += rank.overall_rating;
		hikeRankCount += 1;
		hikeAvgRating = hikeAvgRating / hikeRankCount; 						

		Hike.findByIdAndUpdate(hike._id,{ $set: { avg_overall_rating:  hikeAvgRating , rank_count: hikeRankCount}}, function(err, hike){
			if(err) {
				console.log(err);
				throw err;
			}
		});
	});
}
function getRankingPageId(hike, callback) {
	var rankingPageId;
	if(hike.ranking_pages.length > 0) {
		rankingPageId = hike.ranking_pages[hike.ranking_pages.length - 1];
		RankingPage.findById(rankingPageId, function(err, rankingPage){
			if (err) {
				console.log(err);
				throw err;
			}

			if( rankingPage.count >= 20 ) {
				addRankingPageToHike(hike, rankingPage.page, callback);
			} else {
				callback(null, rankingPage);
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
		console.log(err);
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
    		callback(null, "");
    	}

    	var rankArr = user.rank_history;
    	var hikeObjectId = new ObjectID(hikeId);
    	for(var i in rankArr) {
    		if(rankArr[i].hike_id == hikeId) {
    			callback(rankArr[i].rank_id, "You have already rank this hike, adding a new rank will delete your last rank");
    			foundMatch = true;
    		}

    	}

    	if(!foundMatch) {
    		callback(null, "");
    	}
    });
}

