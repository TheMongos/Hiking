var mongoose = require('mongoose');

var rankSchema = mongoose.Schema({

	username: 		String, 
	hike_id: 		mongoose.Schema.Types.ObjectId,
	hike_name: 		String, 
	posted: 		{ type: Date, default: Date.now }, 
	overall_rating: { type: Number, min: 0, max: 5 }, 
	difficulty: 	{ type: Number, min: 0, max: 5 },
	cleanliness: 	{ type: Number, min: 0, max: 5 },
	description: 	String

});

module.exports = mongoose.model('Rank', rankSchema);