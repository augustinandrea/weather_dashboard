// variable for the appid
var appid = "e220c3600cfba6fa487ae22391462d2f";
var city_name_arr = [];
var button_or_list = true;


// The function for clicking when you have to search for a city.
$("#search_button").on("click", function (event) {
  event.preventDefault();
  // variable for the city
  var city_name = $("#search_city").val();


  initial_search_weather(city_name, true);

});

$("#previous_cities_list").on("click", "li", click_old_city);
$(window).on("load", load_last_city);


//------------All the given functions needed------------------------------------------------------
function initial_search_weather(city_name, button_or_list) {
  // weather city url
  var weatherurl = "https://api.openweathermap.org/data/2.5/weather?APPID=" + appid + "&q=" + city_name;

  $.ajax({ url: weatherurl, method: "GET" }).then(function (response) {

    // The given date
    var date = new Date(response.dt * 1000).toLocaleDateString();

    //This is the weather icon
    var weather_icon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon + ".png");

    // kelvin to F
    var tempInt = parseInt(response.main.temp);
    var tempF = (tempInt * 9 / 5) - 459.67;
    var city_temp = $("<p class='temp'>").text(Math.floor(tempF) + "°F");
    var city_humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
    var city_windspeed = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");

    var name_and_date= $("<h2>").text(response.name + " " + "(" + date + ")");

    // Empty the contents of the city-box div, append the current weather of searched city
    $("#city_weather").empty();
    $("#city_weather").append(name_and_date, weather_icon, city_temp, city_humidity, city_windspeed);

    //----------------UV INDEX-------------------------------------
    var lat = response.coord.lat;
    var lon = response.coord.lon;
    uv_call(lat, lon);

    // calling the 5-day forecast & adding to the list
    five_day_forecast(city_name);

    if (button_or_list === true) {
      city_name_arr = JSON.parse(localStorage.getItem("city_names"));

      if (city_name_arr == null) {
        city_name_arr = [];
        city_name_arr.push(city_name);

        localStorage.setItem("city_names", JSON.stringify(city_name_arr));
        city_search_list(city_name);
      }
      else {
        if ( find(city_name) > 0) {
          city_name_arr.push(city_name);
          localStorage.setItem("city_names", JSON.stringify(city_name_arr));
          city_search_list(city_name);
        }
      }
    }

  });

}

// function for adding a city to the list
function city_search_list(city_name) {

  // Constructing HTML containing the weather information for searched city
  var city_name_list = $("<li class= 'old_city' >").text(city_name);
  city_name_list.addClass("previous_cities_list");

  // prepend the searched city onto city-list
  $("#previous_cities_list").prepend(city_name_list);

}

// function for clicking old city 
function click_old_city(event) {
  var list_el = event.target;

  if (event.target.matches("li")) {

    city_name = list_el.textContent.trim();
    initial_search_weather(city_name, false);

  }

}

// load the last city
function load_last_city() {

  $("ul").empty();
    var city_name_arr = JSON.parse(localStorage.getItem("city_names"));
    
    if(city_name_arr !== null){

        city_name_arr= JSON.parse(localStorage.getItem("city_names"));

        for(i= 0; i < city_name_arr.length; i++){   
          city_search_list(city_name_arr[i]);
        }

        city_name= city_name_arr[i-1];
        initial_search_weather(city_name, false);
    }

}


// function for a 5-day forecast
function five_day_forecast(city_name) {

  var five_day_weather_url = "https://api.openweathermap.org/data/2.5/forecast?APPID=" + appid + "&q=" + city_name;

  $.ajax({ url: five_day_weather_url, method: "GET" }).then(function (response) {

    // for loop for 5 days
    for (var i = 0; i < 5; i++) {

      var date = $("<p>").text(new Date((response.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString());

      //This is the weather icon
      var iconcode = response.list[((i + 1) * 8) - 1].weather[0].icon;
      var icon_url = "https://openweathermap.org/img/wn/" + iconcode + ".png";

      var icon_final = $("<img src=" + icon_url + ">");

      // kelvin to F
      var tempK = response.list[((i + 1) * 8) - 1].main.temp;
      var tempF = (tempK * 9 / 5) - 459.67;
      var city_temp = $("<p class='temp'>").text("Temp: " + Math.floor(tempF) + "°F");
      var city_humidity = $("<p>").text("Humidity: " + response.list[((i + 1) * 8) - 1].main.humidity + "%");
      var city_windspeed = $("<p>").text("Wind Speed: " + response.list[((i + 1) * 8) - 1].wind.speed + " MPH");

      $("#forecast_day_" + i).empty();
      $("#forecast_day_" + i).append(date, icon_final, city_temp, city_windspeed, city_humidity);

    }

  });

}

function uv_call(lat, lon) {

  // construct URL for UV index
  var weatherurl = "https://api.openweathermap.org/data/2.5/uvi?APPID=" + appid + "&lat=" + lat + "&lon=" + lon;

  $.ajax({ url: weatherurl, method: "GET" }).then(function (response) {

    var uv_number = Math.floor(response.value);
    

    var uv_index = $("<p>").text("UV Index: " + uv_number);
    $("#city_weather").append("<div id='uv_box' class=''></div>");
    $("#uv_box").append(uv_index);

    // UV Index Color Change 
    if (uv_number <= 2) {
      $(uv_index).addClass("uv_favorable");
    }
    if (uv_number >= 3 && uv_number <= 8) {
      $(uv_index).addClass("uv_moderate");
    }
    if (uv_number >= 9) {
      $(uv_index).addClass("uv_severe");
    }

  }); // end of uv ajax

}

// searches the city to see if it exists in the entries from the storage
function search(city) {

  for (var i = 0; i < city_name_arr.length; i++) {

    if (city.toUpperCase() === city_name_arr[i]) {
      return -1;
    }
  }
  return 1;
}