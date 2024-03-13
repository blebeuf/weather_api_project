const key = "11701a22eb50e7dd286864fa0017542d";

$(document).ready(function() {
    $('#search-button').click(function() {
        const userInput = $('#user-input').val();
        if (!userInput.trim()) {
            $('#weather-info').html('<p>Please enter a city name.</p>');
            return;
        }
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${key}&units=imperial`;
        const fiveDayForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${userInput}&appid=${key}&units=imperial`;

        // Fetch current weather
        fetchWeather(currentWeatherUrl);

        // Fetch 5-day forecast
        fetchFiveDayForecast(fiveDayForecastUrl);
    });
});

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

function displayFiveDayForecast(data) {
    let forecastHtml = '<h2>5-Day Forecast:</h2><div class="d-flex justify-content-between flex-wrap">';
    
    const forecasts = data.list.filter(forecast => forecast.dt_txt.includes("12:00:00"));

    forecasts.forEach(forecast => {
        const iconURL = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
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

// // function to save searched cities in localStorage 
// function saveCity(newCity) {
//     // Try to retrieve the existing list of cities from localStorage
//     let cities = JSON.parse(localStorage.getItem('cities')) || [];
    
//     // Check if the new city is already in the list to prevent duplicates
//     if (!cities.includes(newCity)) {
//         // Add the new city to the list
//         cities.push(newCity); 
//         // Save the updated list back to localStorage
//         localStorage.setItem('cities', JSON.stringify(cities));
//     }
// }
