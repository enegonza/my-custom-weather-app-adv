let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function retrieveWeather(city) {
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=e5d23o984ba0b21973288194ctbda24f&units=imperial`;
  axios.get(apiUrl).then(updatedCity);
}

function updatedCity(response) {
  let cityName = response.data.city;
  let cityElement = document.querySelector("#city-h1");
  let tempElement = document.querySelector("#currTemperature");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dayElement = document.querySelector("#day-Today");
  let iconElement = document.querySelector("#icon");

  let unixTime = response.data.time;

  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="current-temp-icon">`;

  if (cityElement) {
    cityElement.textContent = cityName;
  }
  if (tempElement) {
    tempElement.textContent = Math.round(response.data.temperature.current);
  }

  descriptionElement.textContent = response.data.condition.description;
  humidityElement.textContent = `${response.data.temperature.humidity}%`;

  let windSpeedKmh = response.data.wind.speed;
  let windSpeedMph = (windSpeedKmh * 0.621371).toFixed(2);
  windElement.textContent = `${windSpeedMph} mph`;

  let localDate = new Date(unixTime * 1000);
  dayElement.textContent = formatDate(localDate);
  updateTimeWithAPI(localDate);

  retrieveForecast(cityName);
}
function retrieveForecast(city) {
  let forecastApiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=e5d23o984ba0b21973288194ctbda24f&units=imperial`;
  axios.get(forecastApiUrl).then(displayForecast);
}

function formatDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

  return days[date.getDay()];
}

function updateTimeWithAPI(localDate) {
  let hours = localDate.getHours();
  let minutes = localDate.getMinutes();
  let ampm = hours >= 12 ? ` PM` : ` AM`;
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;

  let currentTime = `${hours}:${minutes}${ampm}`;
  let timeElement = document.querySelector("#current-time");
  if (timeElement) {
    timeElement.textContent = currentTime;
  }
}

function chngCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#enter-city").value.trim();
  if (cityInput) {
    retrieveWeather(cityInput);
  }
}

function displayForecast(response) {
  console.log(response.data);
  let forecastElement = document.querySelector("#forecast");

  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `  
        <div class="weather-forecast-row-col">
          <div class="weather-forecast-row-col-day">${formatDate(
            day.time
          )}</div>
          <div class="weather-forecast-row-col-icon"> <img src = "${
            day.condition.icon_url
          }"> </div>
          <div class="weather-forecast-row-col-temps">
          <div class="weather-forecast-temp"><strong>${Math.round(
            day.temperature.maximum
          )}°</strong></div>
          <div class="weather-forecast-temp">${Math.round(
            day.temperature.minimum
          )}°</div>
          </div>
        </div>
        `;
    }
  });
  forecastElement.innerHTML = forecastHtml;
}

let defaultCity = "Gaza";
retrieveWeather(defaultCity);

let form = document.querySelector("#city-form");
if (form) {
  form.addEventListener("submit", chngCity);
}

let searchButton = document.querySelector("#search-city-click");
if (searchButton) {
  searchButton.addEventListener("click", chngCity);
}
