var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voteSchema = new Schema({
  ip: String,
  optionId: { type: Number, ref: 'Option' },
  pollId: { type: Number, ref: 'Poll' }
}, 
{timestamps: true});

module.exports = mongoose.model('Vote', voteSchema);