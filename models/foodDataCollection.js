var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var foodDataSchema = new Schema({
    name: String,
    quantity: Number,
    amount: Number,
    protein: Number,
    fat: Number,
    calorie: Number,
    carbohydrate: Number,
    fiber: Number,
    calcium: Number,
    chromium: Number,
    copper: Number,
    fluoride: Number,
    iodine: Number,
    iron: Number,
    magnesium: Number,
    manganese: Number,
    molybdenum: Number,
    phosphorus: Number,
    selenium: Number,
    zinc: Number,
    potassium: Number,
    sodium: Number,
    chloride: Number,
    "vitamin-A": Number,
    "vitamin-C": Number,
    "vitamin-D": Number,
    "vitamin-E": Number,
    "vitamin-K": Number,
    thiamin: Number,
    riboflavin: Number,
    niacin: Number,
    "vitamin-B6": Number,
    folate: Number,
    "vitamin-B12": Number,
    "pantothenic-acid": Number,
    biotin: Number,
    choline: Number
});

module.exports = mongoose.model('foodData', foodDataSchema);