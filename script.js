const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".Current-wether .details");
const weatherCardsDiv = document.querySelector(".Weather-cards");

const API_KEY = "023ae4b4f5b0a31dc241c5c9296b75d8"; 


const createWeatherCard = (cityName, weatherItem, index) => {
    const date = new Date(weatherItem.dt_txt).toLocaleDateString(); 
    if (index === 0) {
        return `
            <div class="details">
                <h2>${cityName} (${date})</h2>
                <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}℃</h4>
                <h4>Wind: ${weatherItem.wind.speed} m/s</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
            </div>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                <h4>${weatherItem.weather[0].description}</h4>
            </div>
        `;
    } else {
        return `
            <li class="cards">
                <h3>(${date})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}℃</h4>
                <h4>Wind: ${weatherItem.wind.speed} m/s</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
            </li>
        `;
    }
};


const getWeatherDetails = (lat, lon, cityName = "Current Location") => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then(res => res.json())
        .then(data => {
            const uniqueForecastDays = [];
            const fiveDaysForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    uniqueForecastDays.push(forecastDate);
                    return true;
                }
                return false;
            });

            
            currentWeatherDiv.innerHTML = "";
            weatherCardsDiv.innerHTML = "";

         
            fiveDaysForecast.forEach((weatherItem, index) => {
                if (index === 0) {
                    currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                } else {
                    weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                }
            });
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("An error occurred while fetching the weather forecast.");
        });
};


const getCurrentLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            getWeatherDetails(latitude, longitude, "Current Location");
        }, (error) => {
            alert("Unable to retrieve your location.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
};


searchButton.addEventListener("click", () => {
    const cityName = cityInput.value.trim();
    if (cityName) {
        getCityCoordinates(cityName);
    }
});


locationButton.addEventListener("click", getCurrentLocation);


const getCityCoordinates = (cityName) => {
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            if (data.length) {
                const { lat, lon } = data[0];
                getWeatherDetails(lat, lon, cityName); 
            } else {
                alert("City not found.");
            }
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates.");
        });
};
