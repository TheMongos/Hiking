
var rankingPageSchema = mongoose.Schema({

    hike_id: mongoose.Schema.Types.ObjectId,
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