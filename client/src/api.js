import $ from 'jquery';

const dietTracker = {};
//module variables that are exposed. TODO: research if there should be any global
//modules in variables. If not, how can external programs access those variables?
dietTracker.searchResults = [];
dietTracker.nutrientTracker = [];
//this collects the names of the selected food items that the user makes changes
//to so that we can update those food items when saving.
// dietTracker.itemsUpdated = [];

//IDs and Keys
dietTracker.Id = "3c51cd82"
dietTracker.key = "bd1ba708718f85892c404d8bd8cc48b2"

//TODO: add error handling
//search Nutritionix database
dietTracker.getItem = function(itemName) {
  //make an AJAX GET request
  return $.ajax({
    url: 'https://trackapi.nutritionix.com/v2/search/instant',
    method:'GET',
    dataType:'JSON',
    headers: {
      "x-app-id": dietTracker.Id,
      "x-app-key": dietTracker.key
    },
    data: {
      query: itemName,
      branded: "false",
    }
  })
  .then(function(res) {
    //return the first 5 search results.
    return res.common.map(item => item.food_name).slice(0,5);
  })
};

dietTracker.getNutrients = function(itemName) {
  //make AJAX POST request to get nutritional information
  return $.ajax({
    url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
    method:'POST',
    dataType:'JSON',
    headers: {
      "x-app-id": dietTracker.Id,
      "x-app-key": dietTracker.key
    },
    data: {
      query: itemName
    }
  }).then(function(res) {
    return dietTracker.addNutrientInfo(res);
  });
};

//filters the nutrients that you want to track from Nutritionix's API response
//TODO: desired nutrients should be fed into to dietTracker. It should be external
//to the module
dietTracker.filterTrackedNutrients = function(nutrient) {
  if ([203, 204, 205, 208, 291, 301, 303, 304, 305, 306, 307, 309, 312, 313, 315, 317,
        318, 321, 322, 323, 324, 325, 326, 401, 404, 405, 406, 410, 415, 417, 418, 421, 430,
        501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517,
        518, 521, 601, 605, 606, 617, 621, 629, 630, 631, 645, 646, 671, 672, 675, 685, 851, 852,
        853, 855
       ].indexOf(nutrient.attr_id) >= 0) {
    return true;
  }
};

//make sure the nutrient names below match the table headers in hmtl because they are
//used to match up the corresponding values from each item to their correct location
//in the table
dietTracker.nutrientCodes = [{code:203, nutrient: "protein", unit: "g"},
                             {code:204, nutrient: "fat", unit: "g"},
                             {code:205, nutrient: "carbohydrate", unit: "g"},
                             {code:208, nutrient: "calorie", unit: "cal"},
                             {code:291, nutrient: "fiber", unit: "g"},
                            {code:301, nutrient: "calcium", unit: "mg"},
                            {code:303, nutrient: "iron", unit: "mg"},
                            {code:304, nutrient: "magnesium", unit: "mg"},
                            {code:305, nutrient: "phosphorus", unit: "mg"},
                            {code:306, nutrient: "potassium", unit: "mg"},
                            {code:307, nutrient: "sodium", unit: "mg"},
                            {code:309, nutrient: "zinc", unit: "mg"},
                            {code:312, nutrient: "copper", unit: "mg"},
                            {code:313, nutrient: "fluoride", unit: "mcg"},
                            {code:315, nutrient: "manganese", unit: "mcg"},
                            {code:317, nutrient: "selenium", unit: "ug"},
                            {code:318, nutrient: "vitamin-A", unit: "IU"},
                            {code:321, nutrient: "carotene-beta", unit: "mcg"},
                            {code:322, nutrient: "carotene-alpha", unit: "mcg"},
                            {code:323, nutrient: "vitamin-E", unit: "mg"},
                            {code:324, nutrient: "vitamin-D", unit: "IU"},
                            {code:325, nutrient: "vitamin-D2", unit: "mcg"},
                            {code:326, nutrient: "vitamin-D3", unit: "mcg"},
                            {code:401, nutrient: "vitamin-C", unit: "mg"},
                            {code:404, nutrient: "thiamin", unit: "mg"},
                            {code:405, nutrient: "riboflavin", unit: "mg"},
                            {code:406, nutrient: "niacin", unit: "mg"},
                            {code:410, nutrient: "pantothenic-acid", unit: "mg"},
                            {code:415, nutrient: "vitamin-B6", unit: "mg"},
                            {code:417, nutrient: "folate", unit: "mcg"},
                            {code:418, nutrient: "vitamin-B12", unit: "mcg"},
                            {code:421, nutrient: "choline", unit: "mg"},
                            {code:430, nutrient: "vitamin-K", unit: "mcg"},
                            {code:501, nutrient: "tryptophan", unit: "g"},
                            {code:502, nutrient: "threonine", unit: "g"},
                            {code:503, nutrient: "isoleucine", unit: "g"},
                            {code:504, nutrient: "leucine", unit: "g"},
                            {code:505, nutrient: "lysine", unit: "g"},
                            {code:506, nutrient: "methionine", unit: "g"},
                            {code:507, nutrient: "cystine", unit: "g"},
                            {code:508, nutrient: "phenylalanine", unit: "g"},
                            {code:509, nutrient: "tyrosine", unit: "g"},
                            {code:510, nutrient: "valine", unit: "g"},
                            {code:511, nutrient: "arginine", unit: "g"},
                            {code:512, nutrient: "histidine", unit: "g"},
                            {code:513, nutrient: "alanine", unit: "g"},
                            {code:514, nutrient: "aspartic-acid", unit: "g"},
                            {code:515, nutrient: "glutamic-acid", unit: "g"},
                            {code:516, nutrient: "glycine", unit: "g"},
                            {code:517, nutrient: "proline", unit: "g"},
                            {code:518, nutrient: "serine", unit: "g"},
                            {code:521, nutrient: "hydroxyproline", unit: "g"},
                            {code:601, nutrient: "cholesterol", unit: "mg"},
                            {code:621, nutrient: "omega3-DHA", unit: "g"},
                            {code:629, nutrient: "omega3-EPA", unit: "g"},
                            {code:631, nutrient: "omega3-DPA", unit: "g"},
                            {code:851, nutrient: "omega3-ALA", unit: "g"},
                            {code:852, nutrient: "omega3-ETE", unit: "g"},
                            {code:672, nutrient: "omega6-eicosadienoic-acid", unit: "g"},
                            {code:675, nutrient: "omega6-linoleic-acid", unit: "g"},
                            {code:685, nutrient: "omega6-GLA", unit: "g"},
                            {code:853, nutrient: "omega6-DGLA", unit: "g"},
                            {code:617, nutrient: "omega9-oleic-acid", unit: "g"},
                            {code:630, nutrient: "omega9-erucic-acid", unit: "g"},
                            {code:671, nutrient: "omega9-nervonic-acid", unit: "g"},
                            {code:605, nutrient: "fatty-acids-trans", unit: "g"},
                            {code:606, nutrient: "fatty-acids-saturated", unit: "g"},
                            {code:645, nutrient: "fatty-acids-monounsaturated", unit: "g"},
                            {code:646, nutrient: "fatty-acids-polyunsaturated", unit: "g"}
                          ];

dietTracker.nutrientUnits = {"protein": "g",
                             "fat":"g",
                            "carbohydrate":"g",
                            "calorie":"cal",
                            "fiber": "g",
                            "calcium":"mg",
                            "iron":"mg",
                            "magnesium": "mg",
                            "phosphorus":"mg",
                            "potassium":"mg",
                            "sodium": "mg",
                            "zinc": "mg",
                            "copper": "mg",
                            "fluoride": "mcg",
                            "manganese": "mg",
                            "selenium": "mcg",
                            "vitamin-A": "IU",
                            "carotene-beta": "mcg",
                            "carotene-alpha": "mcg",
                            "vitamin-E":"mg",
                            "vitamin-D":"IU",
                            "vitamin-D2":"mcg",
                            "vitamin-D3":"mcg",
                            "vitamin-C": "mg",
                            "thiamin": "mg",
                            "riboflavin": "mg",
                            "niacin": "mg",
                            "pantothenic-acid": "mg",
                            "vitamin-B6": "mg",
                            "folate": "mcg",
                            "vitamin-B12": "mcg",
                            "choline": "mg",
                            "vitamin-K": "mcg",
                            "tryptophan":"g",
                            "threonine":"g",
                            "isoleucine": "g",
                            "leucine":"g",
                            "lysine": "g",
                            "methionine":"g",
                            "cystine": "g",
                            "phenylalanine":"g",
                            "tyrosine":"g",
                            "valine":"g",
                            "arginine":"g",
                            "histidine":"g",
                            "alanine":"g",
                            "aspartic-acid":"g",
                            "glutamic-acid":"g",
                            "glycine":"g",
                            "proline":"g",
                            "serine":"g",
                            "hydroxyproline":"g",
                            "cholesterol":"mg",
                            "omega3-DHA":"g",
                            "omega3-EPA":"g",
                            "omega3-DPA":"g",
                            "omega3-ALA":"g",
                            "omega3-ETE":"g",
                            "omega6-eicosadienoic-acid":"g",
                            "omega6-linoleic-acid":"g",
                            "omega6-GLA":"g",
                            "omega6-DGLA":"g",
                            "omega9-oleic-acid":"g",
                            "omega9-erucic-acid":"g",
                            "omega9-nervonic-acid":"g",
                            "fatty-acids-trans":"g",
                            "fatty-acids-saturated":"g",
                            "fatty-acids-monounsaturated":"g",
                            "fatty-acids-polyunsaturated":"g"
                            }
//create object that stores all selected food items and their nutritional information.
// dietTracker.nutrientTracker = {};

//NutritionInfo Object Structure
//{food1: {name: name, amount: value, protein:value, fat: value, cals: value, carb: value},
// food2: {name: name, amount: value, protein:value, fat: value, cals: value, carb: value}}
//
//
//
//
//


//Store/add nutrient info for a single food item to nutrientTracker object.
//Requires 2 parameters (nutrientInfo (straight from Nutritionix API) and name of food item)
//TODO: the algorithm for filtering this array could probably be improved. Can do in 1 step
dietTracker.addNutrientInfo = function(nutrientInfo) {
  nutrientInfo = nutrientInfo.foods[0];
  const foodItem = nutrientInfo.food_name;
  // dietTracker.nutrientTracker[foodItem]= {};
  // dietTracker.nutrientTracker[foodItem].name = foodItem;
  // //quantity is 1 by default
  // dietTracker.nutrientTracker[foodItem].quantity = 1;
  // dietTracker.nutrientTracker[foodItem].amount = nutrientInfo.serving_weight_grams;

  let foodData = {};
  foodData.quantity = 1;
  foodData.amount = nutrientInfo.serving_weight_grams;
  foodData.name = foodItem;

  nutrientInfo = nutrientInfo.full_nutrients.filter(nutrient => dietTracker.filterTrackedNutrients(nutrient));


//populate the food item object nested within nutrientTracker with nutritional info
//for that foor item
  nutrientInfo.forEach(function(attribute) {
    dietTracker.nutrientCodes.forEach(function(nutrientCode) {
      if (attribute.attr_id === nutrientCode.code) {
          // dietTracker.nutrientTracker[foodItem][nutrientCode.nutrient]= attribute.value;
          foodData[nutrientCode.nutrient]= attribute.value;
      }
    });
  });

  return foodData;
  // dietTracker.nutrientTracker.push(foodData);
  // console.log(dietTracker.nutrientTracker);
};

export default dietTracker;
