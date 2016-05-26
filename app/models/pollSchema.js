var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var responseSchema = new Schema({ response: String, votes: Number},{_id: false});

var pollSchema = new Schema({
  _id:  Number,
  creator: String,
  question: String,
  responses: [responseSchema],
  voters: [String]
}, 
{timestamps: true});

module.exports = mongoose.model('Poll', pollSchema);