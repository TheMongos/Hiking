var mongoose    = require('mongoose');

var rankingPageSchema = mongoose.Schema({

    hike_id: { type : mongoose.Schema.Types.ObjectId, index: true },
    page: Number, 
    count: Number,
    comments: [ {
        rank_id: mongoose.Schema.Types.ObjectId,
        posted: Date,
        author: String, 
        overall_rating: Number,
        short_description: String
    } ]

});

module.exports = mongoose.model('RankingPage', rankingPageSchema);