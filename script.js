
const apiKey = "711b4abe36afb0ec51d7c862c4caa46c";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q="


const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector (".search button");
const weatherIcon = document.querySelector(".weather-icon");

const hourly = document.getElementById("hourly");
const handle = document.getElementById("handle");

const bookmark = document.getElementById("bookmark")
const bookmarked = document.getElementById("bookmarked")
const cityNameEl = document.querySelector(".city");


//This function will get all of the weather data
async function checkWeather(city) {
        
    const response = await fetch(weatherUrl + city + `&appid=${apiKey}`);
    const data = await response.json();

    if (data.cod && data.cod !== 200) {
        alert("City not found");
        return;
    }

    console.log(data);

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "&deg;C";
    document.querySelector(".weather-type").innerHTML = data.weather[0].main;
    document.querySelector(".rain").innerHTML = (data.rain && data.rain['1h'] ? data.rain['1h'] : 0) + "mm";
    document.querySelector(".wind").innerHTML = data.wind.speed + "Km/h";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".feelsLike").innerHTML = data.main.feels_like + "&deg;C";

    if(data.weather[0].main == 'Clouds') {
        weatherIcon.src = "http://openweathermap.org/img/wn/02d@2x.png";
    } else if(data.weather[0].main == 'Clear') {
        weatherIcon.src = "http://openweathermap.org/img/wn/01d@2x.png"; 
    } else if(data.weather[0].main == "Rain") {
        weatherIcon.src = "http://openweathermap.org/img/wn/10d@2x.png"; 
    } else if(data.weather[0].main == "Drizzle") {
        weatherIcon.src = "http://openweathermap.org/img/wn/09d@2x.png";
    } else if(data.weather[0].main == "Snow") {
        weatherIcon.src = "http://openweathermap.org/img/wn/13d@2x.png";
    } else if (data.weather[0].main == "Thunderstorm") {
        weatherIcon.src = "http://openweathermap.org/img/wn/11d@2x.png";
    } else {
        weatherIcon.src = "http://openweathermap.org/img/wn/50d@2x.png";
    }

    checkHourlyForecast(city);
}


// This function will display hourly forecast
async function checkHourlyForecast(city) {
    const response = await fetch(forecastUrl + city + `&appid=${apiKey}`);
    const data = await response.json();

    const hourlyForecastDiv = document.getElementById("hourly-content");
    hourlyForecastDiv.innerHTML = ""; // Clear previous content

    const next24Hours = data.list.slice(0,8);

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours().toString().padStart(2,"0") + ":00";
        const temp = Math.round(item.main.temp) + "°C";
        const icon = item.weather[0].icon;

        const block = `
            <div class="hour-block">
                <div class="hour">${hour}</div>
                <img class="hour-icon" src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="icon">
            </div>
        `;
        hourlyForecastDiv.innerHTML += block;
    });
}

    
// for search button
searchBtn.addEventListener("click", ()=>{
    checkWeather(searchBox.value);
});

checkWeather('Glasgow');



 // to open hourly forecast
handle.addEventListener("click", () => {
    hourly.classList.toggle("open");
});

// when saving bookmark
bookmark.addEventListener("click", () => {
    const city = cityNameEl.textContent;
    bookmark.classList.add("clicked")
    bookmarked.classList.add("saved");
    updateSavedCities(city, true); 
});

// when unsaving bookmark
bookmarked.addEventListener("click", () => {
    const city = cityNameEl.textContent;
    bookmark.classList.remove("clicked")
    bookmarked.classList.remove("saved");
    updateSavedCities(city, false); 
});

// prevent images from being saveable
document.querySelectorAll('img').forEach(img => {
  img.setAttribute('draggable', 'false');
  img.addEventListener('dragstart', event => event.preventDefault());
});




