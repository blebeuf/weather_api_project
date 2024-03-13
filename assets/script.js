const key = "11701a22eb50e7dd286864fa0017542d";

$(document).ready(function() {
    loadSavedCities(); // Load and display saved city buttons on initial page load

    // error handler for the fetch
    // notes and review for arrow functions - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
    function performSearch() {
        const userInput = $('#user-input').val().trim();
        if (!userInput) {
            $('#weather-info').html('<p>Please enter a city name.</p>');
            return;
        }
        // Save the city to localStorage
        saveCity(userInput);
        // Refresh the list of saved city buttons 
        loadSavedCities();

         // Add "&units=imperial" to get the temperature in Fahrenheit
        // here's a link to assist with switching units: https://openweather.my.site.com/s/article/switching-between-temperature-units-2019-10-24-21-47-24
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${key}&units=imperial`;
        const fiveDayForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${userInput}&appid=${key}&units=imperial`;

        fetchWeather(currentWeatherUrl);
        fetchFiveDayForecast(fiveDayForecastUrl);
    }

    // Setup click event listener for the search button
    $('#search-button').click(performSearch);

    // Setup keypress (Enter key) event listener for the user input field
    $('#user-input').keypress(function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent the default form action
            performSearch();
        }
    });

    // Event delegation for dynamically added saved city buttons
    $('#saved-cities').on('click', '.saved-city-btn', function() {
        const city = $(this).text();
        $('#user-input').val(city);
        performSearch();
    });
});

// saving searches to localStorage
function saveCity(newCity) {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    if (!cities.includes(newCity)) {
        cities.push(newCity);
        localStorage.setItem('cities', JSON.stringify(cities));
    }
}

function loadSavedCities() {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    $('#saved-cities').empty(); // Clear existing buttons
    cities.forEach(city => {
        $('#saved-cities').append(`<button class="btn btn-secondary my-2 saved-city-btn" type="button">${city}</button>`);
    });
}

// this portion was updated with a tutor and referneced here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
//used to create an exception and halt the normal execution flow of a program or function
function fetchWeather(requestUrl) {
    fetch(requestUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(displayCurrentWeather)
        .catch(error => {
            console.error('Fetch error:', error);
            $('#weather-info').append('<p>Failed to retrieve current weather data. Please try again.</p>');
        });
}

function displayCurrentWeather(data) {
    // Assuming temperature is displayed in Fahrenheit or Celsius
    // displays icons on the card
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    const currentWeatherHtml = `
        <h2>Current Weather for ${data.name}:</h2>
        <div class="card my-3">
            <div class="card-body">
                <h5 class="card-title">${data.name}</h5>
                <img src="${iconUrl}" alt="Weather icon">
                <p class="card-text">Temperature: ${data.main.temp}°F</p>
                <p class="card-text">Condition: ${data.weather[0].description}</p>
                <p class="card-text">Humidity: ${data.main.humidity}%</p>
                <p class="card-text">Wind Speed: ${data.wind.speed} mph</p>
            </div>
        </div>
    `;
    $('#weather-info').html(currentWeatherHtml);
}

function fetchFiveDayForecast(requestUrl) {
    fetch(requestUrl)
        .then(response => response.json())
        .then(displayFiveDayForecast)
        .catch(error => console.error('Fetch error for 5-day forecast:', error));
}

// five day forecast display
function displayFiveDayForecast(data) {
    let forecastHtml = '<h2>5-Day Forecast:</h2><div class="d-flex justify-content-between flex-wrap">';
    
    // 
    const forecasts = data.list.filter(forecast => forecast.dt_txt.includes("12:00:00"));

    forecasts.forEach(forecast => {
        const iconURL = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
    //The toLocaleDateString() method is used to convert the Date object into a localized date string - displaying the date in a format that's appropriate for the local user.
        forecastHtml += `
            <div class="weather-card card m-2" style="min-width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${new Date(forecast.dt_txt).toLocaleDateString()}</h5>
                    <img src="${iconURL}" alt="Weather icon">
                    <p class="card-text">Temp: ${forecast.main.temp}°F</p>
                    <p class="card-text">Condition: ${forecast.weather[0].description}</p>
                    <p class="card-text">Humidity: ${forecast.main.humidity}%</p>
                </div>
            </div>
        `;
    });

    forecastHtml += '</div>';
    // Append to the weather-info to ensure current weather and forecast are shown together
    $('#weather-info').append(forecastHtml);
}
