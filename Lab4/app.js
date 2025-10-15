// app.js
// Fetches OpenWeatherMap + Open-Meteo data and displays them.

// Troy, NY coordinates:
const defaultLocation = { name: "Troy, NY", lat: 42.7284, lon: -73.6918 };

const weatherDisplay = document.getElementById("weatherDisplay");
const aqDisplay = document.getElementById("aqDisplay");
const creative = document.getElementById("creative");
const refreshWeatherBtn = document.getElementById("refreshWeather");
const refreshAQBtn = document.getElementById("refreshAQ");
const showHeadersBtn = document.getElementById("showHeaders");
const openDocsBtn = document.getElementById("openDocs");
const locBtn = document.getElementById("locBtn");

function fmtTemp(k) {
  const c = k - 273.15;
  const f = c * 9 / 5 + 32;
  return `${c.toFixed(1)}°C / ${f.toFixed(1)}°F`;
}

let lastWeatherHeaders = null;
let lastMeteoHeaders = null;

async function fetchWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}`;
  const resp = await fetch(url);
  lastWeatherHeaders = resp.headers;
  const json = await resp.json();
  return { json, resp };
}

// 🌎 Open-Meteo replacement for OpenAQ
async function fetchOpenMeteo(lat, lon) {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,sulphur_dioxide`;
  const resp = await fetch(url);
  lastMeteoHeaders = resp.headers;
  const json = await resp.json();
  return { json, resp };
}

function renderWeather(json) {
  if (!json || json.cod >= 400) {
    weatherDisplay.innerHTML = `<div class="text-danger">Unable to get weather (${json?.message || 'error'})</div>`;
    return;
  }

  const name = json.name || defaultLocation.name;
  const temp = fmtTemp(json.main.temp);
  const feels = fmtTemp(json.main.feels_like);
  const humidity = json.main.humidity;
  const wind = `${json.wind.speed} m/s`;
  const desc = json.weather[0].description;
  const icon = json.weather[0].icon;
  const sunrise = new Date(json.sys.sunrise * 1000);
  const sunset = new Date(json.sys.sunset * 1000);

  weatherDisplay.innerHTML = `
    <div class="d-flex align-items-center gap-3">
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
      <div>
        <h6 class="mb-0">${name} — ${desc}</h6>
        <div class="small text-muted">Temperature: ${temp} (feels like ${feels})</div>
        <div class="small text-muted">Humidity: ${humidity}% • Wind: ${wind}</div>
        <div class="small text-muted">Sunrise: ${sunrise.toLocaleTimeString()} • Sunset: ${sunset.toLocaleTimeString()}</div>
      </div>
    </div>
  `;

  // creative suggestion
  const hour = new Date().getHours();
  const sunniness = json.weather[0].main.toLowerCase();
  let suggestion = "Enjoy your day!";
  if (sunniness.includes("rain")) suggestion = "Take an umbrella ☔";
  else if (sunniness.includes("snow")) suggestion = "Bundle up ❄️";
  else if (sunniness.includes("clear") && hour < 18) suggestion = "Great time for a walk along the Hudson!";
  creative.textContent = `Sunrise: ${sunrise.toLocaleTimeString()}, Sunset: ${sunset.toLocaleTimeString()}. ${suggestion}`;
}

function renderMeteo(json) {
  if (!json || !json.current) {
    aqDisplay.innerHTML = `<div class="text-warning">No air-quality data available.</div>`;
    return;
  }

  const c = json.current;
  const aqi = c.european_aqi;
  const pm25 = c.pm2_5;
  const pm10 = c.pm10;
  const ozone = c.ozone;
  const no2 = c.nitrogen_dioxide;
  const co = c.carbon_monoxide;
  const so2 = c.sulphur_dioxide;

  aqDisplay.innerHTML = `
    <ul class="list-group">
      <li class="list-group-item">European AQI: <strong>${aqi}</strong></li>
      <li class="list-group-item">PM2.5: ${pm25} µg/m³</li>
      <li class="list-group-item">PM10: ${pm10} µg/m³</li>
      <li class="list-group-item">Ozone (O₃): ${ozone} µg/m³</li>
      <li class="list-group-item">Nitrogen Dioxide (NO₂): ${no2} µg/m³</li>
      <li class="list-group-item">Carbon Monoxide (CO): ${co} µg/m³</li>
      <li class="list-group-item">Sulphur Dioxide (SO₂): ${so2} µg/m³</li>
    </ul>
  `;
}

function logHeaders() {
  console.log("=== OpenWeatherMap Headers ===");
  if (lastWeatherHeaders) {
    for (const [k, v] of lastWeatherHeaders.entries()) console.log(`${k}: ${v}`);
  }
  console.log("=== Open-Meteo Headers ===");
  if (lastMeteoHeaders) {
    for (const [k, v] of lastMeteoHeaders.entries()) console.log(`${k}: ${v}`);
  }
}

async function refreshAll(location = defaultLocation) {
  try {
    weatherDisplay.innerHTML = `<div class="text-muted">Loading weather...</div>`;
    const { json: wjson } = await fetchWeather(location.lat, location.lon);
    renderWeather(wjson);

    aqDisplay.innerHTML = `<div class="text-muted">Loading air-quality...</div>`;
    const { json: aqjson } = await fetchOpenMeteo(location.lat, location.lon);
    renderMeteo(aqjson);
  } catch (err) {
    console.error(err);
    weatherDisplay.innerHTML = `<div class="text-danger">Error fetching weather.</div>`;
    aqDisplay.innerHTML = `<div class="text-danger">Error fetching air quality.</div>`;
  }
}

function enableGeolocation() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported.");
    return;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    const loc = { name: "Your location", lat: pos.coords.latitude, lon: pos.coords.longitude };
    refreshAll(loc);
  }, () => {
    alert("Geolocation denied. Using Troy, NY.");
  });
}

refreshWeatherBtn.addEventListener("click", () => refreshAll(defaultLocation));
refreshAQBtn.addEventListener("click", () => refreshAll(defaultLocation));
showHeadersBtn.addEventListener("click", logHeaders);
openDocsBtn.addEventListener("click", () => window.open("https://open-meteo.com/en/docs/air-quality-api", "_blank"));
locBtn.addEventListener("click", enableGeolocation);

refreshAll(defaultLocation);
