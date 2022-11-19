const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');



const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY ='49cc8c821cd2aff9af04c9f98c36eb74';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM' 

    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

}, 1000);
let weather = {
  apiKey:"49cc8c821cd2aff9af04c9f98c36eb74",
  fetchWeather: function (city){
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" +city +"&units=metric&appid=" +this.apiKey).then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
    
      
      
  },
  displayWeather: function (data) {
    
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    const { country } = data.sys;
    const { lat } = data.coord;
    const { lon } = data.coord;
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src ="https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText ="Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText ="Wind speed: " + speed + " km/h";
    document.querySelector(".country").innerText ="Country  : " + country;
    document.querySelector(".lat").innerText ="Latitude  : " + lat;
    document.querySelector(".lon").innerText ="Longitude  : " + lon;
    document.querySelector(".weather").classList.remove("loading");
    document.body.style.backgroundImage ="url('https://source.unsplash.com/1600x900/?" + name + "')";
    
  
    getWeatherData (data);
  },
  
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
    
  },
};

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    
    }
    
  });

weather.fetchWeather("Delhi");

function getWeatherData (data) {
  
  navigator.geolocation.getCurrentPosition(() => {
    
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=`+data.coord.lat+`&lon=`+ data.coord.lon+`&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

        showWeatherData(data);
  }) 

    })
}
function showWeatherData (data){
  let {sunrise, sunset} = data.current;

    currentWeatherItemsEl.innerHTML = 
    `
    <div class="weather-item">
        <div>Sunrise :</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset :</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>
    
    
    `;
    
    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
          
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
                
            </div>
      
            `
        }else{
          
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
                
            </div>
            
            `
        }
    })


    weatherForecastEl.innerHTML = otherDayForcast;
}
