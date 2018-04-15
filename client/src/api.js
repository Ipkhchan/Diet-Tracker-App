import $ from 'jquery';

const dietTracker = {};
//module variables that are exposed. TODO: research if there should be any global
//modules in variables. If not, how can external programs access those variables?
dietTracker.searchResults = [];
dietTracker.nutrientTracker = [];
//this collects the names of the selected food items that the user makes changes
//to so that we can update those food items when saving.
dietTracker.itemsUpdated = [];

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
    dietTracker.searchResults = res.common.map(item => item.food_name);
    console.log(dietTracker.searchResults);
  })
};

dietTracker.getNutrients = function(itemName) {
  //make AJAX POST request to get nutritional information
  $.ajax({
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
    console.log(res)
    dietTracker.addNutrientInfo(res);
  });
};

//filters the nutrients that you want to track from Nutritionix's API response
//TODO: desired nutrients should be fed into to dietTracker. It should be external
//to the module
dietTracker.filterTrackedNutrients = function(nutrient) {
  if ([203, 204, 208, 209, 301, 303, 304, 305, 306, 307, 309, 312, 313, 315, 317,
        318, 321, 322, 323, 324, 325, 326, 401, 404, 405, 406, 410, 415, 417, 418, 421, 430
       ].indexOf(nutrient.attr_id) >= 0) {
    return true;
  }
};

//make sure the nutrient names below match the table headers in hmtl because they are
//used to match up the corresponding values from each item to their correct location
//in the table
dietTracker.nutrientCodes = [{code:203, nutrient: "protein"},
                             {code:204, nutrient: "fat"},
                             {code:208, nutrient: "calorie"},
                             {code:209, nutrient: "carbohydrate"},
                            {code:301, nutrient: "calcium"},
                            {code:303, nutrient: "iron"},
                            {code:304, nutrient: "magnesium"},
                            {code:305, nutrient: "phosphorus"},
                            {code:306, nutrient: "potassium"},
                            {code:307, nutrient: "sodium"},
                            {code:309, nutrient: "zinc"},
                            {code:312, nutrient: "copper"},
                            {code:313, nutrient: "fluoride"},
                            {code:315, nutrient: "manganese"},
                            {code:317, nutrient: "selenium"},
                            {code:318, nutrient: "vitamin-A"},
                            {code:321, nutrient: "carotene-beta"},
                            {code:322, nutrient: "carotene-alpha"},
                            {code:323, nutrient: "vitamin-E"},
                            {code:324, nutrient: "vitamin-D"},
                            {code:325, nutrient: "vitamin-D2"},
                            {code:326, nutrient: "vitamin-D3"},
                            {code:401, nutrient: "vitamin-C"},
                            {code:404, nutrient: "thiamin"},
                            {code:405, nutrient: "riboflavin"},
                            {code:406, nutrient: "niacin"},
                            {code:410, nutrient: "pantothenic-acid"},
                            {code:415, nutrient: "vitamin-B6"},
                            {code:417, nutrient: "folate"},
                            {code:418, nutrient: "vitamin-B12"},
                            {code:421, nutrient: "choline"},
                            {code:430, nutrient: "vitamin-K"}];

//create object that stores all selected food items and their nutritional information.
dietTracker.nutrientTracker = {};

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
  dietTracker.nutrientTracker[foodItem]= {};
  dietTracker.nutrientTracker[foodItem].name = foodItem;
  //quantity is 1 by default
  dietTracker.nutrientTracker[foodItem].quantity = 1;
  dietTracker.nutrientTracker[foodItem].amount = nutrientInfo.serving_weight_grams;
  // Object.defineProperty(dietTracker.nutrientTracker[foodItem],"defaultServingSize", {
  //   value: nutrientInfo.serving_weight_grams,
  //   enumerable: false
  // })
  // dietTracker.nutrientTracker[foodItem].nutrients = [];
  nutrientInfo = nutrientInfo.full_nutrients.filter(nutrient => dietTracker.filterTrackedNutrients(nutrient));
  // console.log(nutrientInfo);

//populate the food item object nested within nutrientTracker with nutritional info
//for that foor item
  nutrientInfo.forEach(function(attribute) {
    dietTracker.nutrientCodes.forEach(function(nutrientCode) {
      if (attribute.attr_id == nutrientCode.code) {
          dietTracker.nutrientTracker[foodItem][nutrientCode.nutrient]= attribute.value;
          //dietTracker.nutrientTracker[foodItem].nutrients.push([nutrientCode.nutrient, attribute.value]);
      }
    });
  });
};

export default dietTracker;
