//  DOM Elements 
const weatherContainer = document.getElementById('weather-container');
const locationElement = document.getElementById('location');
const tempElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const iconElement = document.getElementById('weather-icon');
const feelsLikeElement = document.getElementById('feels-like');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const secondApiContainer = document.getElementById('second-api-container');
const newsHeaderElement = document.getElementById('news-header');
const newsContentElement = document.getElementById('second-api-content');


const openWeatherApiKey = 'c81489afd5d230b3ef7452cc96412aff';
const newsApiKey = '70439559e4de4efa87bb5b8d192e8f76';
const troyCoords = { lat: 42.7284, lon: -73.6918 };

// Executed on page load ---
window.addEventListener('load', () => {
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
});

// Geolocation Handlers 
function handleGeoSuccess(position) {
    const { latitude, longitude } = position.coords;
    console.log("Geolocation successful:", { latitude, longitude });
    fetchWeatherData(latitude, longitude);
}

function handleGeoError(error) {
    console.error("Geolocation error:", error.message);
    alert("Could not get your location. Showing weather for Troy, NY instead.");
    fetchWeatherData(troyCoords.lat, troyCoords.lon);
}

//  OpenWeatherMap API Fetch
function fetchWeatherData(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=imperial`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log("OpenWeatherMap Data:", data);
            displayWeatherData(data);
            // After weather is displayed, fetch news for that location's country
            fetchNewsData(data.sys.country);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            locationElement.textContent = "Weather data unavailable.";
            weatherContainer.classList.remove('loading');
            // Also handle news container loading state on weather error
            newsHeaderElement.textContent = "News unavailable";
            secondApiContainer.classList.remove('loading');
        });
}

//  News API Fetch
function fetchNewsData(countryCode) {
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=${countryCode.toLowerCase()}&apiKey=${newsApiKey}&pageSize=5`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`News API HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log("NewsAPI Data:", data);
            displayNewsData(data, countryCode);
        })
        .catch(error => {
            console.error('Error fetching news data:', error);
            newsHeaderElement.textContent = `Could not fetch news.`;
            secondApiContainer.classList.remove('loading');
        });
}

//  DOM Update Funcs
function displayWeatherData(data) {
    if (!data || !data.main || !data.weather) {
        locationElement.textContent = "Could not parse weather data.";
        return;
    }
    locationElement.textContent = `${data.name}, ${data.sys.country}`;
    tempElement.textContent = `${Math.round(data.main.temp)}°F`;
    descriptionElement.textContent = data.weather[0].description;
    feelsLikeElement.textContent = `${Math.round(data.main.feels_like)}°F`;
    humidityElement.textContent = `${data.main.humidity}%`;
    windSpeedElement.textContent = `${Math.round(data.wind.speed)} mph`;
    iconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    iconElement.alt = data.weather[0].description;
    weatherContainer.classList.remove('loading');
}

function displayNewsData(data, countryCode) {
    newsHeaderElement.textContent = `Top Headlines in ${countryCode}`;
    newsContentElement.innerHTML = ''; // Clear previous content

    if (!data.articles || data.articles.length === 0) {
        newsContentElement.textContent = 'No top headlines found.';
        secondApiContainer.classList.remove('loading');
        return;
    }

    data.articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.className = 'news-article';

        const titleElement = document.createElement('h3');
        const linkElement = document.createElement('a');
        linkElement.href = article.url;
        linkElement.textContent = article.title;
        linkElement.target = '_blank'; // Open in new tab
        linkElement.rel = 'noopener noreferrer';
        titleElement.appendChild(linkElement);

        const sourceElement = document.createElement('span');
        sourceElement.textContent = article.source.name;

        articleElement.appendChild(titleElement);
        articleElement.appendChild(sourceElement);
        newsContentElement.appendChild(articleElement);
    });

    secondApiContainer.classList.remove('loading');
}

function displayNewsApiKeyError() {
    newsHeaderElement.textContent = "API Key Missing!";
    newsContentElement.innerHTML = `Please add your NewsAPI key to <code>script.js</code>.`;
    secondApiContainer.classList.remove('loading');
}