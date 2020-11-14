const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const todoSchema = new Schema({
  name: { type: String, required: true },
  priority: { type: String, required: true },
  date: { type: String, required: true },
  notes: { type: String, required: true },
  compelete: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model('Todolist', todoSchema);
