var weatherData;
var longitude;
var latitude;
var search = [];
var APIkey = "9bb75379c10c93616c0fec796743f122";

function cityStart() {
    var startURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIkey;

    // Call the fetch function passing the url of the API as a parameter
    fetch(startURL)
    .then(function(response){
        response.json().then(function(data) {
        getCoord(data);
        });
    });
}

function getCoord(info){
    longitude = info.coord.lon;
    latitude = info.coord.lat;
    getWeather();
}

function getWeather(){
    var coordURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly&units=imperial&appid=" + APIkey;

    fetch (coordURL)
    .then(function(response){
        response.json().then(function(data){
            todayWeather(data.current);
            forecastWeather(data.daily);
        });
    });
}

function todayWeather(current){
    document.getElementById('today').textContent = "";
    var today = document.getElementById('today');

    today.innerHTML = "<h4>" + city + " (" + moment().format("M/D/YYYY") + ") <img src='http://openweathermap.org/img/w/" + current.weather[0].icon + ".png'></img></h4><p>Temperature: " + current.temp + " &#8457</p><p>Humidity: " + current.humidity + "%</p><p>Wind Speed: " + current.wind_speed + " MPH</p><p>UV Index: <span id='uvIndex'>" + current.uvi + "</span></p>";

    var uviColor = document.getElementById("uvIndex");

    if (current.uvi < 6) {
        uviColor.setAttribute("class", "badge badge-info");
    } else if (current.uvi > 6 && current.uvi < 8) {
        uviColor.setAttribute("class", "badge badge-success");
    } else if (current.uvi > 8 && current.uvi < 11) {
        uviColor.setAttribute("class", "badge badge-warning");
    } else if (current.uvi > 11) {
        uviColor.setAttribute("class", "badge badge-danger");
    }
}

$(".btn").on("click", function() {
    var input = $("#citySearch");
    city = input.val();
    cityStart();
});