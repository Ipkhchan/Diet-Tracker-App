var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserDailyDietSchema = new Schema({
    name: String,
    quantity: Number,
    amount: Number,
    protein: Number,
    fat: Number,
    calorie: Number,
    carbohydrate: Number
});

module.exports = mongoose.model('UserDailyDiet', UserDailyDietSchema);
