// on loading the window
window.onload = function () {

  // The function for clicking when you have to search for a city.
  // When search is clicked
  $("#search_button").on("click", function (event) {
    event.preventDefault();

    // variable for the city
    var city_name = $("#search_city").val();
    //var current_date = new Date().format("dddd LL");

    // weather city url
    var weatherurl = "https://api.openweathermap.org/data/2.5/weather?q=" + city_name + "&APPID=e220c3600cfba6fa487ae22391462d2f";

    
    $.ajax({ url: weatherurl, method: "GET" }).then(function (response) {

      // Constructing HTML containing the weather information for searched city
      var city_name = $("<h2>").text(response.name);
      var city_name_list = $("<li>").text(response.name);
      city_name_list.addClass("previous_cities_list");

      //This is the weather icon
      var weather_icon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon + ".png");
      var weather_type = $("<p clas= 'bold'>").text(response.weather[0].main);

      // kelvin to F
      var tempInt = parseInt(response.main.temp);
      var tempF = (tempInt * 9 / 5) - 459.67;
      var city_temp = $("<p class='temp'>").text(Math.floor(tempF) + "°F");
      var city_humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
      var city_windspeed = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");

      // Empty the contents of the city-box div, append the current weather of searched city
      $("#city_weather").empty();
      $("#city_weather").append(city_name, weather_type, weather_icon, city_temp, city_humidity, city_windspeed);

      // prepend the searched city onto city-list
      $("#previous_cities_list").prepend(city_name_list);

      // UV INDEX
      var lat = response.coord.lat;
      var lon = response.coord.lon;

      // construct URL for UV index
      var weatherurl_2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&APPID=e220c3600cfba6fa487ae22391462d2f";

      $.ajax({ url: weatherurl_2, method: "GET" }).then(function (response2) {

        var uv_index = $("<p>").text("UV Index: " + Math.floor(response2.value));
        $("#city_weather").append("<div id='uv_box' class=''></div>");
        $("#uv_box").append(uv_index);

        // UV Index Color Change 
        if (Math.floor(response2.value) <= 2) {
          $("#uv_box").addClass("uvFavorable");
        } if (Math.floor(response2.value) >= 3 && Math.floor(response2.value) <= 8) {
          $("#uv_box").addClass("uvModerate");
        } if (Math.floor(response2.value) >= 9) {
          $("#uv_box").addClass("uvSevere");
        }

      });
    });

  })
}