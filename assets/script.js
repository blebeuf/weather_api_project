const key = "11701a22eb50e7dd286864fa0017542d";
const userInputEl = $('#user-input');
const recentSearch = "";
const btnEl = $('#search-button');

function currentWeather (event) {
    event.preventDefault();

    const userInput = userInputEl.val();
    const requestUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${userInput}&appid=${key}`;

    console.log(userInput);
    console.log(requestUrl);

    fetch(requestUrl)
    .then(function (response) {
        if (response.ok) {
            response.json()
            .then(function(data) {
                console.log(data);
        })
    } else {
        console.log("error")
    }

    })
}

btnEl.on('click', currentWeather);