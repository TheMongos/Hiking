var mongoose 	= require('mongoose');
var bcrypt		= require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	
	username: 		String,
	password: 		String,
	first_name:		String,
	last_name:		String, 
	creation_date:  { type: Date, default: Date.now }, 
	hike_history: [ {
		hike_id: 	mongoose.Schema.Types.ObjectId, 
		hike_name: 	String, 
		date: 		Date, 
		hike_data: {
			distance:	Number,
			time:		Number	
		}
	} ],
	rank_history: [ {
		hike_name: 		String, 
		overall_rating: Number
	} ]

});

userSchema.methods.generateHash = function(password) { 

	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);	

};

userSchema.methods.validPassword = function(password) {

	return bcrypt.compareSync(password, this.password);

};

module.exports = mongoose.model('User', userSchema);