const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'TestPaper', required: true },
  answers: [String],
  score: Number,
});

module.exports = mongoose.model('Response', responseSchema);
