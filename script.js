const APIKey = import.meta.env.OPEN_WEATHER_API_KEY;

const searchForm = document.getElementById("searchForm");
const searchBtn = document.getElementById("searchBtn");
const searchResults = document.getElementById("searchResults");

const cityWeather = document.getElementById("cityWeather");
const tempWeather = document.getElementById("tempWeather");
const humidityWeather = document.getElementById("humidityWeather");
const windWeather = document.getElementById("windWeather");
const UVIndexWeather = document.getElementById("UVIndexWeather");
const days = document.getElementById("days");
const eachDay = document.getElementById("eachDay");

const eachDayTemp = document.getElementById("eachDayTemp");
const eachDayHumidity = document.getElementById("eachDayHumidity");
const eachDayWind = document.getElementById("eachDayWind");

let cityName = null;
if (JSON.parse(localStorage.getItem("All cities")))
  cityNames = JSON.parse(localStorage.getItem("All cities"));
else cityNames = [];

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  cityName = document.querySelector("#citySearch").value;
  if (cityName) {
    cityNames.push(cityName);
    localStorage.setItem("All cities", JSON.stringify(cityNames));
    cityBtns();
  }

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const lat = data.coord.lat;
      const lon = data.coord.lon;
      const temp = (data.main.temp - 273.15).toFixed(1);
      const wind = data.wind.speed;
      const humidity = data.main.humidity;
      const dt = data.dt * 1000;
      let date = new Date(dt);
      const dayDate = date.toDateString();
      const day = dayDate.slice(0, 3);
      date = date.toLocaleString().slice(0, 10);

      cityWeather.innerText = `${cityName}  ${date} ${day}`;
      tempWeather.innerText = `Temprature: ${temp} C`;
      humidityWeather.innerText = `Humidity: ${humidity} %`;
      windWeather.innerText = `wind: ${wind} MPH`;

      fetch(
        `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&APPID=${APIKey}`
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const uvi = data.value;

          UVIndexWeather.innerText = `UVI: ${uvi}`;

          if (uvi <= 4) {
            colorSet = "green";
          } else if (uvi >= 4 && uvi <= 7) {
            colorSet = "yellow";
          } else if (uvi > 7) {
            colorSet = "red";
          }
          UVIndexWeather.style.backgroundColor = colorSet;
        })
        .catch((e) => console.error(e));
    })
    .catch((e) => console.error(e));

  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIKey}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let flag = false;

      for (let i = data.list.length - 1; i > 0; i = i - 8) {
        let dateDay = data.list[i].dt_txt;
        dateDay = dateDay.slice(0, 10);

        const tempDay = data.list[i].main.temp;
        const humidityDay = data.list[i].main.humidity;
        const windDay = data.list[i].wind.speed;

        let testDiv = document.createElement("div");
        testDiv.classList.add("eachDayCard");
        if (flag == true) {
          days.removeChild(testDiv);
        }
        testDiv.innerHTML = `    
          <h5 class="text-white m-2 p-1">Date: ${dateDay}</h5>
          <h5 class="text-white m-2 p-1">Temp: ${tempDay}F</h5>
          <h5 class="text-white m-2 p-1">Humidity: ${humidityDay}%</h5>
          <h5 class="text-white m-2 p-1">Wind: ${windDay}MPH</h5>
        `;
        days.prepend(testDiv);
      }
    })
    .finally(() => {
      flag = true;
    });
});

function cityBtns() {
  searchResults.innerHTML = "";
  for (var i = 0; i < cityNames.length; i++) {
    let newCityBtn = document.createElement("button");
    newCityBtn.setAttribute("type", "button");
    newCityBtn.setAttribute("class", "btn btn-primary m-1 cityBtn");
    newCityBtn.innerText = cityNames[i];
    searchResults.prepend(newCityBtn);
  }
}
