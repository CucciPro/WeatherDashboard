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
        if (response.ok) {
            response.json().then(function(data) {
            getCoord(data);
            });
        } else {
            alert("Error: " + response.statusText);
        }
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

function forecastWeather(future){
    forecastTitle = document.getElementById('5day-forecast');
    forecastTitle.innerHTML = "<h3>5-Day Forecast:</h3>"

    forecastDisplay = document.getElementById('forecast');
    forecastDisplay.innerHTML = "";

    for (var i = 1; i < 6; i++) {
        var forecast = document.createElement("div");
        forecast.setAttribute("class", "badge badge-primary p-3 mb-3 text-left");
        forecast.innerHTML = "<h6>" + moment().add(i, 'days').format("M/D/YYYY") + "</h6><img src='http://openweathermap.org/img/w/" + future[i].weather[0].icon + ".png'></img><p>Temp: " + future[i].temp.max + " &#8457</p><p>Humidity: " + future[i].humidity + "%</p>";
        forecastDisplay.appendChild(forecast);    
    }
}

function previousSearch() {
    var location = city;

    if (search.length == 0){
        
        search.push(location);
    }
    else if(search.indexOf(location) == -1) {

        search.push(location);
    }
    
    localStorage.setItem("search", JSON.stringify(search));

    getPrevious();
}

function getPrevious() {

    searchData = JSON.parse(localStorage.getItem("search"));

    document.getElementById('list').textContent = "";

    var oList = document.createElement("div");
    for (i = 0; i < searchData.length; i++) {
        var list = document.createElement("ul");
        list.setAttribute("onclick", "previousClick(this.id)");
        list.textContent = searchData[i];
        var idName = list.textContent;
        list.setAttribute("id", idName);
        oList.appendChild(list);
        document.getElementById('list').appendChild(oList);
    };

}

function previousClick(clicked_id){
    city = clicked_id;
    previousSearch();
    cityStart();
}

$(".btn").on("click", function() {
    var input = $("#citySearch");
    city = input.val();
    cityStart();
    previousSearch();
});

getPrevious();