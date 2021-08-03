// jshint esversion:6
let breakfast = ["Acai bowl", "Croissant", "Avocado Toast", "Jam Tartine", "Pain au chocolat", "Cereal", "English breakfast"];
let drinks = ["Smoothie", "Beer", "Tea", "Coffe", "Water", "Ice cream", "Wine", "Iced oat latte", "Ice Tea", "Juice", "Hot chocolat", "Mule wine"];
let lunch = ["Risotto", "Pasta pesto", "Cheese & Bread", "Veggie Pizza", "Scramble egg", "Leek pie", "Salty cake"];
let diner = ["Paella", "Fish & Chips", "Sunday roast", "Burger", "Dahl", "Pad Thai", "Dumbling", "Miso Soup", "Chicken salade", "Lasagne"];
let meal = [... lunch, ...diner];
const date = new Date();
const hours = date.getHours();
const year = date.getFullYear();

$(document).ready(function() {

  $("#current-year").text(year);

  $("button.btn").click(function() {
    const url = "login.html";
    $(location).attr('href', url);
  });

  $("#button-drinks").click(function() {
    let todayDrink = getRandomVictual(drinks);
    modifyLayoutVictualResult("drinks", todayDrink);
  });

  $("#button-meal").click(function() {
    foodOptions = getFood(hours,meal,breakfast);
    let todayMeal = getRandomVictual(foodOptions);
    modifyLayoutVictualResult("meal", todayMeal);
  });

});

function getFood(hours,meal,breakfast) {
  if (hours >= 11 || hours < 5) {
    return meal;
  } else if (hours >= 5 && hours < 11) {
    return breakfast;
  }
}

function getRandomVictual(listVictuals) {
  let randomNumberVictual = Math.floor(listVictuals.length * (Math.random()));
  return listVictuals[randomNumberVictual];
}

function modifyLayoutVictualResult(idVictual, todayVictual) {
  const pattern = /meal/;
  let colorMeal = "#ffeb99";
  let colorDrink = "rgba(128, 247, 227, 0.7)";
  $("#today-" + idVictual).text(todayVictual);
  $("#button-" + idVictual).text("Try Again");
  $("div").remove(".signup-" + idVictual);
  $("#today-" + idVictual).addClass("result");
  $("#today-" + idVictual).css({
    "font-size": "2.5em"
  });
  if (pattern.test(idVictual)) {
    $("#today-" + idVictual).css({
      "text-decoration-color": colorMeal
    });
  } else {
    $("#today-" + idVictual).css({
      "text-decoration-color": colorDrink
    });
  }
}
