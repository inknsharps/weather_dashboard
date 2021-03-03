// Query selectors for existing elements on the page
let searchFieldEl = document.querySelector(".search-field");
let searchButtonEl = document.querySelector(".submit-search");
let searchHistoryEl = document.querySelector(".search-history");

// Function to build li elements for the search history
function buildSearchHistory(city){
    const li = document.createElement("li");
    li.className = "list-group-item";
    const button = document.createElement("button");
    button.className = "btn btn-outline-secondary submit-saved-city";
    button.setAttribute("type", "button");
    button.textContent = city;
    li.appendChild(button);
    searchHistoryEl.appendChild(li);
}

// Function to call the current weather data (currently in metric), with the argument for the city
function callWeather(city){
    let calledWeatherData = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=704f3b5ee25c5694ae0db66afd13ab60&units=metric`
    console.log(calledWeatherData);
    fetch(calledWeatherData)
        .then((response) => { 
            return response.json();
        })
        .then((weatherData) => {
            console.log(weatherData);

        });
}

// Function to search for a city
function searchCity(){
    let searchValue = searchFieldEl.value;
    callWeather(searchValue);
    buildSearchHistory(searchValue);
}

// Event Listener for the search button
searchButtonEl.addEventListener("click", searchCity);