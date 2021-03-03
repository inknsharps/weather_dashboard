// Query selectors for existing elements on the page
let searchFieldEl = document.querySelector(".search-field");
let searchButtonEl = document.querySelector(".submit-search");
let searchHistoryEl = document.querySelector(".search-history");
let currentWeatherEl = document.querySelector(".current-weather");

// Function to build li elements for the search history
function buildSearchHistory(city){
    let li = document.createElement("li");
    li.className = "list-group-item";
    let button = document.createElement("button");
    button.className = "btn btn-outline-secondary submit-saved-city";
    button.setAttribute("type", "button");
    button.textContent = city;
    li.appendChild(button);
    searchHistoryEl.appendChild(li);
}

// Function to build the 5 day forecast
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
        forecastCard.appendChild(buildHTML("h5", "card-title", "Date"));
        forecastCard.appendChild(buildHTML("p", "weather-img", "Weather Image"));
        forecastCard.appendChild(buildHTML("p", "temperature", "Temperature"));
        forecastCard.appendChild(buildHTML("p", "humidity", "Humidity"));
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
    cardBody.appendChild(buildHTML("h3", "card-title", "Current City"));
    cardBody.appendChild(buildHTML("p", "temperature", "Current Temp"));
    cardBody.appendChild(buildHTML("p", "humidity", "Current Humidity"));
    cardBody.appendChild(buildHTML("p", "windspeed", "Current Wind Speed"));
    cardBody.appendChild(buildHTML("p", "UVindex", "Current UV Index"));
}

// Helper function to create HTML elements
function buildHTML(tag, classes, text){
    const element = document.createElement(tag);
    element.className = classes;
    element.textContent = text;
    return element;
}

// Function to call the current weather data (currently in metric), with the argument for the city
function callWeather(city){
    let calledWeatherData = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=704f3b5ee25c5694ae0db66afd13ab60&units=metric`
    fetch(calledWeatherData)
        .then((response) => { 
            if (response.ok === true){
                return response.json();
            } else {
                alert("Error! Could not retrieve city data.");
            }
        })
        .then((weatherData) => {
            console.log(weatherData);
        })
        .catch((error) => {
            alert("Error! Could not connect to OpenWeatherMap API.");
        });
}

// Function to search for a city and add it to the search history
function searchCity(){
    let searchValue = searchFieldEl.value;
    callWeather(searchValue);
    buildSearchHistory(searchValue);
    buildWeatherMain();
    buildForecast();
}

// Event Listener for the search button
searchButtonEl.addEventListener("click", searchCity);

// TO DO
// Build delete search history functionality
// Populate the built out weather and forecast elements with the weather API
// Build out functionality for imperial and metric measurements??