
// display day
const getDay = new Date();

const displayDay = document.querySelector(".day");

displayDay.innerHTML = getDay.toDateString()

// fetch Data from api
const fetchData = (data) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${data.city}&appid=99982a0396e111de66445b3aa84ce3d8&units=metric`;
  fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log(data);
    if(data.cod === "400") {
      displayAlert("danger", "Bad Request")
    } else if(data.cod === "404") {
      displayAlert("danger", "Sorry City Not Found");
    } else {
    useData(data)
    }
  })
  .catch(error => {
    console.log(error.message);
    displayAlert("danger", error.message);
  })
}

// Initialize auto complete
function initialize() {
  const input = document.getElementById('searchTextField');
  const autocomplete = new google.maps.places.Autocomplete(input);
  google.maps.event.addListener(autocomplete, 'place_changed', function () {
    const place = autocomplete.getPlace();
      document.getElementById('city2').value = place.name || "";
    });
}
google.maps.event.addDomListener(window, 'load', initialize);

const displayAlert = (type, message) => { 
      const showError = document.getElementById("show-error");
        const h5 = document.createElement("h5");
        h5.className = `text-center alert alert-dismissables alert-${type}`;
        h5.textContent = message;
        showError.appendChild(h5);
        setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

// Action on Submit
document.querySelector("#searchForm").addEventListener("submit", (e) => {
  e.preventDefault()
const searchTextField = document.getElementById("searchTextField").value;
if(searchTextField === "") {
  displayAlert("danger", "Sorry..the field are required!!!!");
  return;
}
  const data = {
    city: document.getElementById('city2').value || document.getElementById("searchTextField").value,
  }
  fetchData(data);

  // clear field
  document.getElementById("searchTextField").value = "";
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
  const icon = document.querySelector("#weather-icon")

  const {main, cloud, name, weather, sys, wind } = data;

  temp.innerHTML = `${main.temp}°`
  tempDesc.innerHTML = (weather[0].description).toUpperCase()
  cityName.innerHTML = `${name} ${sys.country}`
  windInfo.innerHTML = `${wind.speed} km/h`
  humidityInfo.innerHTML = `${main.humidity} %`
  sunriseInfo.innerHTML = getTime(sys.sunrise)
  sunsetInfo.innerHTML = getTime(sys.sunset)
  icon.src = `http://openweathermap.org/img/w/${weather[0].icon}.png`
}

// show lagos if position is not available
const showLagos = () => {
  const data = {
    city: "lagos"
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

