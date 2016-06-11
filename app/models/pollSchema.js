var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pollSchema = new Schema({
  _id: Number,
  question: String
},
{timestamps: true});

module.exports = mongoose.model('Poll', pollSchema);