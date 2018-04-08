var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rdiSchema = new Schema({
    source: String,
    age_min: Number,
    age_max: Number,
    sex: String,
    carbohydrate: Number,
    protein: Number,
    fat: Number,
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

module.exports = mongoose.model('RDISet', rdiSchema);
