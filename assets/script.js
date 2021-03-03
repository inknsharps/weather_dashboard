// Query selectors for existing elements on the page
let searchFieldEl = document.querySelector(".search-field");
let searchButtonEl = document.querySelector(".submit-search");

// Function to call the current weather data, with the argument for the city
function callWeather(cityString){
    let currentWeatherData = `https://api.openweathermap.org/data/2.5/weather?q=${cityString}&appid=704f3b5ee25c5694ae0db66afd13ab60`
    console.log(currentWeatherData);
    fetch(currentWeatherData)
        .then((response) => { 
            return response.json();
        })
        .then((data) => {
            console.log(data);
        });
}

// Function to search for a city
function searchCity(){
    let searchValue = searchFieldEl.value;
}

// Event Listener for the search button
searchButtonEl.addEventListener("click", searchCity);