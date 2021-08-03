// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const bcrypt = require("bcrypt");
const md5 = require('md5'); // to get hash function

const saltRounds = 10; // at least 10 add salt to password
const apiKey = "10828389195fb6f96cb815eb05eae243";

let vegan = ["Avocado Toast", "Protein salade", "Lasagne vegan", "Ratatouille", "Salade of quinoa", "Vegan Maki", "Vegan pizza", "Tomate pie", "Mashroom burger", "Roasted Veggie"];
let veggie = vegan.concat(["Risotto", "Pasta pesto", "Cheese and Bread", "Veggie Pizza", "Scramble egg", "Leek pie", "Salty cake"]);
let healthy = ["Sushi", "Acai", "Avocado Toast", "Protein salade", "Scramble egg", "Smoothie", "Proteine Bowl", "Chicken salade", "Lasagne vegan", "Ratatouille", "Salade of quinoa", "Vegan Maki"];
let classicMeal = ["Paella", "Fish and Chips", "Sunday roast", "Burger", "Dahl", "Pad Thai", "Dumbling", "Miso Soup"];
let allMeal = veggie.concat(classicMeal);

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/foodDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  city: String,
  preferences: []
});

const User = mongoose.model("User", userSchema);

const user = {
  username: "",
  city: "",
  preferences: []
};

app.post('/sign-in', function(req, res) {
  user.username = req.body.username;
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      username: req.body.username,
      password: hash
    });
    newUser.save(function(err) {
      if (!err) {
        res.render('preferences');
      } else {
        console.log(err);
        res.redirect("/log");
      }
    });
  });
});

app.post('/preferences', function(req, res) {

  user.city = req.body.city;
  if (req.body.vegan === "vegan") {
    user.preferences = vegan;
  }
  if (req.body.veggie === "veggie") {
    user.preferences = veggie;
  }
  if (req.body.healthy === "healthy") {
    user.preferences = healthy;
  }
  if (req.body.healthy === "healthy" & user.preferences.length !== 0) {
    user.preferences = healthy.filter(value => user.preferences.includes(value));
  }
  if (user.preferences.length === 0) {
    user.preferences = allMeal;
  }

  User.updateOne({
    username: user.username
  }, {
    city: user.city,
    preferences: user.preferences
  }, function(err) {
    if (err) {
      console.log(err);
      res.redirect("/log");
    }
  });

  let query = user.city;
  let units = "metric";
  let url = "https://api.openweathermap.org/data/2.5/weather?appid=" + apiKey + "&q=" + query + "&units=" + units;
  https.get(url, function(response) {
    if (response.statusCode === 200) {
      response.on("data", function(data) {
        var weatherData = JSON.parse(data);
        var temp = weatherData.main.temp;
        var descriptionWeather = weatherData.weather[0].description;
        res.render('login-home', {
          username: user.username,
          city: user.city,
          temp: temp,
          description: descriptionWeather,
          mealOption: user.preferences
        });
      });
    } else {
      console.log(response.statusCode);
      let query = "London";
      let units = "metric";
      let url = "https://api.openweathermap.org/data/2.5/weather?appid=" + apiKey + "&q=" + query + "&units=" + units;
      https.get(url, function(response) {
        response.on("data", function(data) {
          var weatherData = JSON.parse(data);
          var temp = weatherData.main.temp;
          var descriptionWeather = weatherData.weather[0].description;
          res.render('login-home', {
            username: user.username,
            city: user.city + "(defaut city as the input city does not matching any knowning)",
            temp: temp,
            description: descriptionWeather,
            mealOption: user.preferences
          });
        });
      });
    }
  });
});

app.post("/log-in", function(req, res) {
  User.find({
      username: req.body.usernameLog
    },
    function(err, userFound) {
      if (err) {
        console.log(err);
        res.redirect("/");
      }
      if (userFound.length !== 0) {
        bcrypt.compare(req.body.passwordLog, userFound[0].password, function(err, result) {
          if (result === true) {
            let query = userFound[0].city;
            let units = "metric";
            let url = "https://api.openweathermap.org/data/2.5/weather?appid=" + apiKey + "&q=" + query + "&units=" + units;
            https.get(url, function(response) {
              if (response.statusCode === 200) {
                response.on("data", function(data) {
                  var weatherData = JSON.parse(data);
                  var temp = weatherData.main.temp;
                  var descriptionWeather = weatherData.weather[0].description;
                  res.render('login-home', {
                    username: userFound[0].username,
                    city: userFound[0].city,
                    temp: temp,
                    description: descriptionWeather,
                    mealOption: userFound[0].preferences
                  });
                });
              } else {
                console.log(response.statusCode);
                let query = "London";
                let units = "metric";
                let url = "https://api.openweathermap.org/data/2.5/weather?appid=" + apiKey + "&q=" + query + "&units=" + units;
                https.get(url, function(response) {
                  response.on("data", function(data) {
                    var weatherData = JSON.parse(data);
                    var temp = weatherData.main.temp;
                    var descriptionWeather = weatherData.weather[0].description;
                    res.render('login-home', {
                      username: userLog[0].username,
                      city: query + "(defaut city as the input city does not matching any cites)",
                      temp: temp,
                      description: descriptionWeather,
                      mealOption: userFound[0].preferences
                    });
                  });
                });
              }
            });
          }
        });
      } else {
        res.redirect("/log");
      }
    });
});


app.get('/login-home', function(req, res) {
  let query = user.city;
  let units = "metric";
  let url = "https://api.openweathermap.org/data/2.5/weather?appid=" + apiKey + "&q=" + query + "&units=" + units;
  https.get(url, function(response) {
    if (response.statusCode === 200) {
      myFunction(response);
    } else {
      console.log(response.statusCode);
      let query = "London";
      let units = "metric";
      let url = "https://api.openweathermap.org/data/2.5/weather?appid=" + apiKey + "&q=" + query + "&units=" + units;
      https.get(url, function(response) {
        response.on("data", function(data) {
          var weatherData = JSON.parse(data);
          var temp = weatherData.main.temp;
          var descriptionWeather = weatherData.weather[0].description;
          res.render('login-home', {
            username: user.username,
            city: query + "(defaut city as the input city does not matching any cites)",
            temp: temp,
            description: descriptionWeather,
            mealOption: user.preferences
          });
        });
      });
    }
  });
});


app.get('/preferences', function(req, res) {
  res.render('preferences');
});

app.get("/", function(req, res) {
  res.render('home');
});

app.get("/log", function(req, res) {
  res.render('log');
});

app.get("/log-in", function(req, res) {
  res.render('log');
});

app.get("/login.html", function(req, res) {
  res.redirect("/log");
});

app.get("/index.html", function(req, res) {
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server");
});


function renderCustumerizePage(response) {
  response.on("data", function(data) {
    var weatherData = JSON.parse(data);
    var temp = weatherData.main.temp;
    var descriptionWeather = weatherData.weather[0].description;
    res.render('login-home', {
      username: user.username,
      city: user.city,
      temp: temp,
      description: descriptionWeather,
      mealOption: user.preferences
    });
  });
}

function renderCustumerizePage(user, temp , descriptionWeather) {
    res.render('login-home', {
      username: user.username,
      city: user.city,
      temp: temp,
      description: descriptionWeather,
      mealOption: user.preferences
    });
}




//mongoose.connection.close();
