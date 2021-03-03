// Query selectors for existing elements on the page
let searchFieldEl = document.querySelector(".search-field");
let searchButtonEl = document.querySelector(".submit-search");
let searchHistoryEl = document.querySelector(".search-history");
let currentWeatherEl = document.querySelector(".current-weather");

// Declare variables for current weather and forecast data objects to be manipulated later
let retrievedCityData;
let retrievedForecastData;

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
    closeButton.addEventListener("click", deleteHistory)
}

// Function for searching with the history
function callHistory(){
    let historyValue = this.textContent; // 'this' is currently the button that we generated
    callWeather(historyValue);
    callForecast(historyValue);
    buildWeatherMain();
    buildForecast();
}

// Function to delete the generated li element in the history
function deleteHistory(event){
    let cityLiEl = event.target;
    console.log(cityLiEl.parentElement.parentElement);
    cityLiEl.parentElement.parentElement.remove();
}

// Function to build the 5 day forecast (NOTE: the daily forecast API is not free, so had to use the 5 day/3 Hour forecast API, hence the weird for loop)
function buildForecast(){
    let forecast = buildHTML("section", "d-flex col-12 flex-wrap forecast");
    currentWeatherEl.appendChild(forecast);
    let forecastHeader = buildHTML("div", "col-12");
    forecast.appendChild(forecastHeader);
    forecastHeader.appendChild(buildHTML("h4", "forecast-title", "5-Day Forecast:"));
    for (let i = 0; i < retrievedForecastData.list.length; i += 8){
        let forecastCard = buildHTML("div", "card");
        forecastCard.setAttribute("style", "width: 15rem;");
        forecast.appendChild(forecastCard);
        forecastCard.appendChild(buildHTML("h5", "card-title", retrievedForecastData.list[i].dt_txt));
        forecastCard.appendChild(buildHTML("p", "weather-img", retrievedForecastData.list[i].weather[0].icon));
        forecastCard.appendChild(buildHTML("p", "temperature", `Temperature: ${retrievedForecastData.list[i].main.temp} C`));
        forecastCard.appendChild(buildHTML("p", "humidity", `Humidity: ${retrievedForecastData.list[i].main.humidity}%`));
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

    console.log(retrievedCityData)
    let cityName = retrievedCityData.name
    console.log(retrievedCityData)

    cardBody.appendChild(buildHTML("h3", "card-title", cityName));
    cardBody.appendChild(buildHTML("p", "temperature", `Temperature: ${Math.round(retrievedCityData.main.temp)} C`));
    cardBody.appendChild(buildHTML("p", "humidity", `Humidity: ${retrievedCityData.main.humidity}%`));
    cardBody.appendChild(buildHTML("p", "windspeed", `Wind Speed: ${retrievedCityData.wind.speed}`));
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
                alert("Error! Could not retrieve city forecast data.");
            }
        })
        .then((data) => {
            return retrievedCityData = data;
        })
        .catch((error) => {
            alert("Error! Could not connect to OpenWeatherMap API.");
        });
}

// Function to call the current 5 day forecast with argument for the city
function callForecast(city){
    let calledForecast = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=704f3b5ee25c5694ae0db66afd13ab60&cnt=40&units=metric`
    fetch(calledForecast)
    .then((response) => { 
        if (response.ok === true){
            return response.json();
        } else {
            alert("Error! Could not retrieve city data.");
        }
    })
    .then((data) => {
        return retrievedForecastData = data;
    })
    .catch((error) => {
        alert("Error! Could not connect to OpenWeatherMap API.");
    });
}

// Function to search for a city and add it to the search history
function searchCity(){
    let searchValue = searchFieldEl.value;
    callWeather(searchValue);
    callForecast(searchValue);
    buildSearchHistory(searchValue);
    // buildWeatherMain();
    // buildForecast();
    searchFieldEl.value = "";
}

// Event Listener for the search button
searchButtonEl.addEventListener("click", searchCity);

// TO DO
// Build search history functionality (delete search history items)
// Populate the built out weather and forecast elements with the weather API object info
    // Issues with chaining the buildWeatherMain() and buildForecast() functions together- need to take a look
    // Need to grab UV Index from another API, apparently
// Build out functionality for imperial and metric measurements??