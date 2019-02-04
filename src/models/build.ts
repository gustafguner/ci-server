var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BuildSchema = new Schema(
  {
    commit_identifier: {type: String, required: true},
    build_date: {type: Date, required: true},
    build_log: {type: String, required: true},
  }
);

// Virtual for build's URL
BuildSchema
.virtual('url')
.get(function () {
  return '/build/' + this._id;
});

//Export model
module.exports = mongoose.model('Build', BuildSchema);
