
// display day
const getDay = new Date();

const displayDay = document.querySelector(".day");

displayDay.innerHTML = getDay.toDateString()

// fetch Data from api
const fetchData = (data) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.long}&appid=99982a0396e111de66445b3aa84ce3d8&units=metric`;
  fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log(data);
    useData(data)
  })
  .catch(error => {
    console.log(error)
  })
}

// Initialize auto complete
function initialize() {
  const input = document.getElementById('searchTextField');
  const autocomplete = new google.maps.places.Autocomplete(input);
  google.maps.event.addListener(autocomplete, 'place_changed', function () {
    const place = autocomplete.getPlace();
      document.getElementById('city2').value = place.name;
      document.getElementById('cityLng').value = place.geometry.location.lng();
      document.getElementById('cityLat').value = place.geometry.location.lat();
    });
}
google.maps.event.addDomListener(window, 'load', initialize);

// Action on Submit
document.querySelector("#searchForm").addEventListener("submit", (e) => {
  e.preventDefault()
  const data = {
    city: document.getElementById('city2').value,
    long: document.getElementById('cityLng').value,
    lat: document.getElementById('cityLat').value
  }
  fetchData(data)
})


// Display data to the UI
const useData = (data) => {
  const temp = document.querySelector(".temp")
  const tempDesc = document.querySelector(".temp-desc")
  const cityName = document.querySelector(".name-head")
  const windInfo = document.querySelector("#wind")
  const humidityInfo = document.querySelector("#humidity")
  const sunriseInfo = document.querySelector("#sunrise")
  const sunsetInfo = document.querySelector("#sunset")

  const {main, cloud, name, weather, sys, wind } = data;

  temp.innerHTML = `${main.temp}°`
  tempDesc.innerHTML = (weather[0].description).toUpperCase()
  cityName.innerHTML = `${name} ${sys.country}`
  windInfo.innerHTML = `${wind.speed} km/h`
  humidityInfo.innerHTML = `${main.humidity} %`
  sunriseInfo.innerHTML = getTime(sys.sunrise)
  sunsetInfo.innerHTML = getTime(sys.sunset)
}

// show lagos if position is not available
const showLagos = () => {
  const data = {
    long: 3.3792,
    lat: 6.5244
  }
  fetchData(data)
}



// Action on load 
window.addEventListener("load", () => showLagos())


// helper function to convert unix time
const getTime = (unix) => {
  const unixMod = unix * 1000;
  const date = new Date(unixMod)
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours}:${minutes} ${hours > 12 ? "PM": "AM"}`
}

