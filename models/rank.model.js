const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rankSchema = new Schema ({
    url: {type: String, required: true },
		shortUrl: {type: Number, required: true }

},{
    timestamps:true,
});




const rankModel = mongoose.model('rankModel', rankSchema);

module.exports = rankModel;