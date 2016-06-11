var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var optionSchema = new Schema({
  _id: Number,
  text: String,
  pollId: { type: Number, ref: 'Poll' }
}, 
{timestamps: true});

module.exports = mongoose.model('Option', optionSchema);