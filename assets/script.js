const key = "11701a22eb50e7dd286864fa0017542d";
const userInputEl = $('#user-input');

// error handler for the fetch
$(document).ready(function() {
// reference to button id in the HTML
    $('#search-button').click(function() {
        const userInput = userInputEl.val();
        // Add "&units=imperial" to get the temperature in Fahrenheit
        // here's a link to assist with switching units: https://openweather.my.site.com/s/article/switching-between-temperature-units-2019-10-24-21-47-24
        const requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${key}&units=imperial`;

        
// error handler for the fetch
        fetch(requestUrl)
            .then(response => {
                if (!response.ok) {
// this portion was updated with a tutor and referneced here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
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
    // Display temperature in Fahrenheit
    const weatherHtml = `
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">${data.name}</h5>
            <p class="card-text">Temperature: ${data.main.temp}°F</p>
            <p class="card-text">Condition: ${data.weather[0].description}</p>
            <p class="card-text">Humidity: ${data.main.humidity}%</p>
            <p class="card-text">Wind Speed: ${data.wind.speed} mph</p>
        </div>
    </div>
`;
$('#weather-info').html(weatherHtml);
}
