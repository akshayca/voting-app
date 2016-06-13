var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pollSchema = new Schema({
  _id: Number,
  question: String,
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  deletedAt: Date
},
{timestamps: true});

module.exports = mongoose.model('Poll', pollSchema);