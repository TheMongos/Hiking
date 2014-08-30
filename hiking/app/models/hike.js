var mongoose 	= require('mongoose');

var hikeSchema = mongoose.Schema({

  name: String,
  area: String,
  length: Number,
  time: String,
  Difficulty: { type : Number, min : 0 , max :5 },
  loc: { type: [Number], index: '2dsphere'},
  rank_count: Number,
  avg_overall_rating: { type : Number, min : 0 , max :5 },
  completed_count: Number,
  description: String,
  ranking_pages: [
    mongoose.Schema.Types.ObjectId
  ]

});

module.exports = mongoose.model('Hike', hikeSchema);
