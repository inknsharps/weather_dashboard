// Query selectors for existing elements on the page
let searchFieldEl = document.querySelector(".search-field");
let searchButtonEl = document.querySelector(".submit-search");
let searchHistoryEl = document.querySelector(".search-history");
let currentWeatherEl = document.querySelector(".current-weather");

// Declare variables for current weather and forecast data objects to be manipulated later
let requestedWeatherData;

// Function to build li elements for the search history, with buttons for functionality
function buildSearchHistory(city){
    let li = document.createElement("li");
    li.className = "list-group-item city-li";
    let cityButton = document.createElement("button");
    cityButton.className = "btn btn-outline-secondary submit-saved-city";
    cityButton.setAttribute("type", "button");
    cityButton.textContent = city;
    let closeButton = document.createElement("button");
    closeButton.className = "close";
    closeButton.setAttribute("type", "button");
    closeButton.innerHTML = "<span aria-hidden='true'>&times;</span>";

    li.appendChild(cityButton);
    li.appendChild(closeButton);
    searchHistoryEl.appendChild(li);
    cityButton.addEventListener("click", callHistory);
    closeButton.addEventListener("click", deleteHistory);
}

// Function for calling weather data from items in the history
async function callHistory(event){
    event.stopPropagation();
    let historyValue = event.target.textContent; // Since this is on a click event listener, we get city name from this
    await callWeather(historyValue);
    removeHTML(".current-weather");
    buildWeatherMain();
    buildForecast();
}

// Function to delete the generated li element in the history
function deleteHistory(event){
    event.stopPropagation();
    let cityLiEl = event.target;
    cityLiEl.parentElement.parentElement.remove();
}

// Function to build the 5 day forecast (NOTE: the daily forecast API is not free, so had to use the 5 day/3 Hour forecast API, hence the weird for loop)
function buildForecast(){
    let forecast = buildHTML("section", "d-flex col-12 flex-wrap forecast");
    currentWeatherEl.appendChild(forecast);
    let forecastHeader = buildHTML("div", "col-12");
    forecast.appendChild(forecastHeader);
    forecastHeader.appendChild(buildHTML("h4", "forecast-title", "5-Day Forecast:"));
    for (let i = 0; i < 5; i++){
        let forecastCard = buildHTML("div", "card");
        forecastCard.setAttribute("style", "width: 15rem;");
        forecast.appendChild(forecastCard);

        // Convert the Unix timestamps in requestedWeatherData to YYYY-MM-DD
        let forecastDateRaw = new Date(requestedWeatherData.dailyForecast[i].dt*1000);
        let forecastDate = forecastDateRaw.toLocaleDateString("en-CA");

        forecastCard.appendChild(buildHTML("h5", "card-title", forecastDate));
        forecastCard.appendChild(buildHTML("p", "weather-img", requestedWeatherData.dailyForecast[i].weather.icon));
        forecastCard.appendChild(buildHTML("p", "temperature", `Temperature: ${requestedWeatherData.dailyForecast[i].temp.day} C`));
        forecastCard.appendChild(buildHTML("p", "humidity", `Humidity: ${requestedWeatherData.dailyForecast[i].humidity}%`));
    }
}

// Function to build current city weather data card
function buildWeatherMain(){
    let selectedCity = buildHTML("section", "col-12 selected-city");
    currentWeatherEl.appendChild(selectedCity);
    let card = buildHTML("div", "card");
    selectedCity.appendChild(card);
    let cardBody = buildHTML("div", "card-body");
    card.appendChild(cardBody);

    cardBody.appendChild(buildHTML("h3", "card-title", `${requestedWeatherData.cityName}`));
    cardBody.appendChild(buildHTML("p", "temperature", `Temperature: ${requestedWeatherData.currentTemp}`));
    cardBody.appendChild(buildHTML("p", "humidity", `Humidity: ${requestedWeatherData.currentHumidity}`));
    cardBody.appendChild(buildHTML("p", "windspeed", `Wind Speed: ${requestedWeatherData.currentWind}`));
    cardBody.appendChild(buildHTML("p", "UVindex", `UV Index: ${requestedWeatherData.currentUVI}`));
}

// Helper function to create HTML elements
function buildHTML(tag, classes, text){
    const element = document.createElement(tag);
    element.className = classes;
    element.textContent = text;
    return element;
}

// Helper function to remove HTML elements
function removeHTML(query){
    let element = document.querySelector(query);
    while (element.firstChild){
        element.removeChild(element.firstChild);
    }
}

// Async function to fetch all the weather data we need
async function callWeather(city){
    // Fetch Current Weather API
    let currentWeatherData = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=704f3b5ee25c5694ae0db66afd13ab60&units=metric`);
    let weatherJSON = await currentWeatherData.json();

    // Get longitude and latitude from Current Weather API, and feed it into the One Call API for daily forecasts, and UV Index
    let lattitude = weatherJSON.coord.lat;
    let longitude = weatherJSON.coord.lon;

    // Fetch One Call API, using lattitude and longitude from Current Weather API
    let oneCallAPI = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lattitude}&lon=${longitude}&units=metric&exclude=current,minutely,hourly,alerts&appid=704f3b5ee25c5694ae0db66afd13ab60`)
    let oneCallJSON = await oneCallAPI.json();

    // Build Object with all the data we need for our app
    requestedWeatherData = {
        cityName: weatherJSON.name,
        currentDate: new Date(weatherJSON.dt*1000),
        currentTemp: `${weatherJSON.main.temp} C`,
        currentHumidity: `${weatherJSON.main.humidity}%`,
        currentWind: `${weatherJSON.wind.speed} km/h`,
        currentUVI: oneCallJSON.daily[0].uvi,
        dailyForecast: oneCallJSON.daily // Don't forget 0 is today!
    }
}

// Function to search for a city and add it to the search history
async function searchCity(){
    let searchValue = searchFieldEl.value;
    await callWeather(searchValue);
    buildSearchHistory(searchValue);
    buildWeatherMain();
    buildForecast();
    searchFieldEl.value = "";
}

// Event Listener for the search button
searchButtonEl.addEventListener("click", ()=>{
    removeHTML(".current-weather");
    searchCity();
});

// TO DO
// Build out functionality for imperial and metric measurements??