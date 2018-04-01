import $ from 'jquery';

const dietTracker = {};
//module variables that are exposed. TODO: research if there should be any global
//modules in variables. If not, how can external programs access those variables?
dietTracker.searchResults = [];
dietTracker.nutrientTracker = [];

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
  if ([203, //protein
       204, //fat
       208, //cal
       209  //carb
       ].indexOf(nutrient.attr_id) >= 0) {
    return true;
  }
};

//make sure the nutrient names below match the table headers in hmtl because they are
//used to match up the corresponding values from each item to their correct location
//in the table
dietTracker.nutrientCodes = [{code:203, nutrient: "protein"},
                             {code:204, nutrient: "fat"},
                             {code:208, nutrient: "cals"},
                             {code:209, nutrient: "carb"}];

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
//TODO: the algorithm for filtering this array could probably be improved
dietTracker.addNutrientInfo = function(nutrientInfo) {
  nutrientInfo = nutrientInfo.foods[0];
  const foodItem = nutrientInfo.food_name;
  dietTracker.nutrientTracker[foodItem]= {};
  dietTracker.nutrientTracker[foodItem].name = foodItem;
  dietTracker.nutrientTracker[foodItem].amount = nutrientInfo.serving_weight_grams;
  Object.defineProperty(dietTracker.nutrientTracker[foodItem],"defaultServingSize", {
    value: nutrientInfo.serving_weight_grams,
    enumerable: false
  })
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

  console.log(typeof dietTracker.nutrientTracker);

  //save into local storage. TODO: more storage to migrate to DB.
  localStorage.setItem("nutrientTracker", JSON.stringify(dietTracker.nutrientTracker));
  dietTracker.addItemTable(dietTracker.nutrientTracker[foodItem]);
};

//Using localStorage for now. TODO: Migrate to back-end later.
dietTracker.storeItems = function() {
  // localStorage.setItem("itemList", selectedItems.innerHTML);
};

//TODO: Migrate to back-end
dietTracker.loadSelectedItems = function() {
  // selectedItems.innerHTML = localStorage.getItem("itemList");
  if (localStorage.getItem("nutrientTracker") != null) {
    dietTracker.nutrientTracker = JSON.parse(localStorage.getItem("nutrientTracker"));
    for (var foodItem in dietTracker.nutrientTracker) {
      dietTracker.addItemTable(dietTracker.nutrientTracker[foodItem]);
    };
  };
};

// search.addEventListener("click", dietTracker.searchItem);
// document.addEventListener("keyup", (e) => {if (e.keyCode == 13) {dietTracker.searchItem()}});
// resultList.addEventListener("click", dietTracker.selectItem);
// selectedItems.addEventListener("click", dietTracker.editSelectedItem);


//
// //TODO: add ability to re-arrange order of result list
// var nutritionData = {
//   food1: {name: "food1", servingSize: 100, protein: 102, carb: 103, fat: 104, cals: 105},
//   food2: {name: "food2", servingSize: 200, protein: 202, carb: 203, fat: 204, cals: 205},
//   food3: {name: "food3", servingSize: 300, protein: 302, carb: 303, fat: 304, cals: 305},
// };
//
// for (const foodItem in nutritionData) {
//   Object.defineProperty(nutritionData[foodItem], "defaultServingSize", {
//     value: 100,
//     enumerable: false
//   });
// };

export default dietTracker;
