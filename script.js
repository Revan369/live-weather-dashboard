const apiKey = '3d734abe8c5eee51a856ad9025dbc628';

// SEARCH BUTTON
const searchButton = $("#search-button"); // LINK TO HTML
searchButton.on("click", function (event) {
  // ON CLICK DO THE FOLLOWING
  event.preventDefault(); // PREVENT DEFAULT

  // USER SEARCH
  const userSearch = $("#search-input").val().trim();
  if (!userSearch) {
    console.error("Please enter a city name");
    return; // Exit the function if the user search is empty
  }

  // CREATE A SEARCH HISTORY ARRAY
  const searchHistory = localStorage.getItem("searchHistory")
    ? JSON.parse(localStorage.getItem("searchHistory"))
    : [];

  // PUSH THE USER SEARCH TO THE SEARCH HISTORY
  searchHistory.push(userSearch);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

  // LINK TO HTML TO USE BELOW
  const history = $("#history");

  // CURRENT WEATHER
  const geoQueryURL =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    userSearch +
    "&limit=1&appid=" +
    apiKey;

  $.ajax({
    url: geoQueryURL,
    method: "GET",
  }).then(function (result) {
    // GET LATTITUDE AND LONGITUDE
    const { lat, lon } = result[0];
    const latFixed = lat.toFixed(2);
    const lonFixed = lon.toFixed(2);

    // RETRIEVE CURRENT WEATHER
    const weatherQueryURL =
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
      latFixed +
      "&lon=" +
      lonFixed +
      "&appid=" +
      apiKey;

    $.ajax({
      url: weatherQueryURL,
      method: "GET",
    }).then(function (result) {
      // CREATE A CURRENT WEATHER DIV
      const currentLocation = result.name;
      const currentDate = dayjs().format("DD/MM/YYYY");
      const currentTempK = result.main.temp;
      const currentWind = result.wind.speed;
      const currentHumidity = result.main.humidity;
      const currentIconId = result.weather[0].icon;
      const currentTempC = (currentTempK - 273.15).toFixed(2);

      const currentWDiv = $("#today");
      const currentWTitle = $("<h2>").text(currentLocation + " " + currentDate);
      
      // Create an image element for the weather icon
      const currentWeatherIcon = $("<img>").attr({
        src: `https://openweathermap.org/img/w/${currentIconId}.png`,
        alt: "Weather Icon",
      });

      const currentWUl = $("<ul>");
      const currentWTempC = $("<li>").text("Temp: " + currentTempC + "°C");
      const currentWWind = $("<li>").text("Wind: " + currentWind + " KPH");
      const currentWHumidity = $("<li>").text("Humidity: " + currentHumidity + "%");

      // Append the weather icon to the currentWTitle
      currentWTitle.append(currentWeatherIcon);

      currentWUl.append(currentWTempC, currentWWind, currentWHumidity);
      currentWDiv.empty().append(currentWTitle, currentWUl);

      // CREATE HISTORY BUTTON FOR USER SEARCH
      const historyBtn = $("<button>").text(userSearch);
      history.append(historyBtn);
    });

    // 5 DAY FORECAST
    // RETRIEVE FORECAST
    const forecastQueryURL =
      "https://api.openweathermap.org/data/2.5/forecast?lat=" +
      latFixed +
      "&lon=" +
      lonFixed +
      "&appid=" +
      apiKey;

    $.ajax({
      url: forecastQueryURL,
      method: "GET",
    }).then(function (result) {
      const forecastWDiv = $("#forecast");

      // Loop through the next 5 days
      for (let i = 0; i < 5; i++) {
        const dayData = result.list[i * 8]; // Data for each day is every 8th element

        // Extract data for the day
        const dayDate = dayjs(dayData.dt_txt).format("dddd");
        const dayTempK = dayData.main.temp;
        const dayTempC = (dayTempK - 273.15).toFixed(2);
        const dayWind = dayData.wind.speed;
        const dayHumidity = dayData.main.humidity;
        const dayIconId = dayData.weather[0].icon;

        // Create a container for the day
        const dayContainer = $("<div>").addClass("day-container");

        // Create an image element for the weather icon
        const dayWeatherIcon = $("<img>").attr({
          src: `https://openweathermap.org/img/w/${dayIconId}.png`,
          alt: "Weather Icon",
        });

        const dayTitle = $("<h5>").text(dayDate);
        const dayTempLi = $("<li>").text("Temp: " + dayTempC + "°C");
        const dayWindLi = $("<li>").text("Wind: " + dayWind + " KPH");
        const dayHumidityLi = $("<li>").text("Humidity: " + dayHumidity + "%");

        // Append elements to the day container
        dayContainer.append(dayWeatherIcon, dayTitle, dayTempLi, dayWindLi, dayHumidityLi);

        // Append the day container to the forecast div
        forecastWDiv.append(dayContainer);
      }
    });
  });
});