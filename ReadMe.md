# Food Picker Website

## Overview

Dynamique and responsive website aiming to help user to decide what to eat or drink.
User can registrer to the website and save their city where they are or live and select their diet preferences for a more custumerize experience.
The website has been deployed on Heroku

## Technologies
* Front-end :
  * HTML
  * CSS
  * Javascript
  * Jquery
  * Boostrap - version 5.0
* Back-end :
  * Node.JS - version 14.17
  * ejs
  *
* DataBase:
  * MongoDB - version 4.4.5

## Usage

On the home, click either on the button next to feeling hungry to get you drink or meal.
For a custumerize experience, go to the login and registre page.
When register, enter a username and password (required) submit. Then fill the preference user form by entering the city where ou live ou currently are, and selection your diets (several direct can be selectioned.
The user id and password with city and preference are save on MongoDB database.

**Start the program**
```
node app.js
```

## Set up

```
npm mongoose
```

## Security
The password will be encrypter with moogose-encrypter and bcrypt.
For security reason please DO NOT choose a password that your are using for sensitive content


#### Visual/Images

![Home Page](public/images/Home-page.png)

![Home Page](public/images/Button.png)

![Home Page](public/images/Log-page.png)

![Home Page](public/images/Setup-page.png)

### Credit

Icons made by [Freepik](https://www.freepik.com) Freepik from (https://www.flaticon.com) [Flaticon] : www.flaticon.com<

Status

### ToDo:

* Tests
* Add Feature to enable users to update their city and preferences

### Contact

Created by aude11
