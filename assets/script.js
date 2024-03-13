const key = "11701a22eb50e7dd286864fa0017542d";
const userInputEl = $('#user-input');

$(document).ready(function() {
// reference to button id in the HTML
    $('#search-button').click(function() {
        const userInput = userInputEl.val();
        // Add "&units=imperial" to get the temperature in Fahrenheit
        // here's a link to assist with switching units: https://openweather.my.site.com/s/article/switching-between-temperature-units-2019-10-24-21-47-24
        const requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${key}&units=imperial`;

        
        // error handler for the fetch
        // notes and review for arrow functions - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
        fetch(requestUrl)
            .then(response => {
                if (!response.ok) {
        // this portion was updated with a tutor and referneced here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
        //used to create an exception and halt the normal execution flow of a program or function
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => displayWeather(data))
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                // prints to the main within <p>
                $('#weather-info').html('<p>Failed to retrieve data. Please try again.</p>');
            });
    });
});

function displayWeather(data) {
    // Assuming temperature is displayed in Fahrenheit or Celsius
    // displays icons on the card
    const iconCode = data.weather[0].icon;
    //example here: https://openweathermap.org/weather-conditions
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
    
    const weatherHtml = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${data.name}</h5>
                <img src="${iconUrl}" alt="Weather icon">
                <p class="card-text">Temperature: ${data.main.temp}°</p>
                <p class="card-text">Condition: ${data.weather[0].description}</p>
                <p class="card-text">Humidity: ${data.main.humidity}%</p>
                <p class="card-text">Wind Speed: ${data.wind.speed}</p>
            </div>
        </div>
    `;
    $('#weather-info').html(weatherHtml);
}
// function to save searched cities in localStorage 
function saveCity(newCity) {
    // Try to retrieve the existing list of cities from localStorage
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    
    // Check if the new city is already in the list to prevent duplicates
    if (!cities.includes(newCity)) {
        // Add the new city to the list
        cities.push(newCity); 
        // Save the updated list back to localStorage
        localStorage.setItem('cities', JSON.stringify(cities));
    }
}
