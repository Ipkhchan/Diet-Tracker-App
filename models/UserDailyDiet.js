var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserDailyDietSchema = new Schema({
    name: String,
    amount: Number,
    protein: Number,
    fat: Number,
    cals: Number,
    carb: Number
});

module.exports = mongoose.model('UserDailyDiet', UserDailyDietSchema);
