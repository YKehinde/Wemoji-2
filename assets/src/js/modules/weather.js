/*
WeatherAPI.js
*/
var _TIME = require('./time');

module.exports = {

	init: function  () {

		console.debug('Here comes the rain!');

		var API_KEY = "a0ca16e077624c07eed0d454dee8678c";
		var API_UNIT_TYPE = "metric";
		var API_URL = "http://api.openweathermap.org/data/2.5/weather?APPID=" + API_KEY + "&units=" + API_UNIT_TYPE;

		var TEMPERATURES = {
			FREEZING	:{MAX: 5, CLASS_NAME:"icon-1f630"},
			COLD		:{MAX: 16, CLASS_NAME:"icon-1f62d"},
			WARM		:{MAX: 22, CLASS_NAME:"icon-1f600"},
			HOT		:{MAX: Number.POSITIVE_INFINITY, CLASS_NAME:"icon-1f60e"},
		};

		UNITS = API_UNIT_TYPE === "metric" ? "&deg;C" : "&deg;F";

		var MESSAGE_LOCATION_NOT_FOUND = "Location not found... Try searching for something else.";
		var MESSAGE_API_REQUEST_ERROR = "There was a problem getting weather data. Please try again.";
		var MESSAGE_SEARCH_NOT_SPECIFIED = "Please specify a search term.";

		var _currentFlag;
		var _currentTemperatureClassName;
		var _currentTimeClassName;
		var _emoji;
		var _flag;
		var _locationNameDisplay;
		var _locationSearchForm;
		var _locationSearchInput;
		var _locationSearchSubmitWrapper;
		var _temperatureDisplay;
		var _waitingForData;
		var placeholder;

		_emoji = document.querySelector(".emoji");
		_flag = document.querySelector(".flag");
		_locationNameDisplay = document.querySelector(".location");
		_locationSearchForm = document.querySelector("#location-search-form");
		_locationSearchInput = document.querySelector(".form-input");
		_locationSearchSubmitWrapper = document.querySelector(".location-search-submit-wrapper");
		_temperatureDisplay = document.querySelector(".temperature");
		_timeContainer = document.querySelector(".timeContainer");

		_waitingForData = false;

		_locationSearchForm.addEventListener("submit", locationSearchFormSubmitHandler);

		navigator.geolocation.getCurrentPosition(geolocationSuccessHandler, geolocationErrorHandler);

		getCurrentTime();
		
		function geolocationSuccessHandler (position) {
			var lat = position.coords.latitude;
			var lon = position.coords.longitude;

			getWeatherDataFromCoords(lat, lon);
		}

		function geolocationErrorHandler (error) {
			console.log("geolocationErrorHandler");
			alert("You have disallowed geolocation.. Sorry but this won't work without it.")
		}

		function apiRequestSuccess (data, xhr) {
			console.log("weather data received", data);

			_waitingForData = false;
			_locationSearchSubmitWrapper.classList.remove("lodaing");

			if (typeof data.cod !== "undefined" && data.cod === "404")
			{
				alert(MESSAGE_LOCATION_NOT_FOUND);
				return;
			}

			var locationName = data.name;
			var countryCode = data.sys.country;
			var temperature = Math.round(data.main.temp);

			if(locationName === "" && countryCode === "")
			{
				alert(MESSAGE_LOCATION_NOT_FOUND);
				return;
			}

			updateLocationDisplay(locationName, countryCode, temperature);
			updateEmoji(temperature);
			updateFlag(countryCode);

			_TIME.displayZone(data.coord.lat, data.coord.lon);
		}

		function apiRequestError (data, xhr){
			alert(MESSAGE_API_REQUEST_ERROR);
			_waitingForData = false
		}

		function getWeatherDataFromCoords(lat, lon) {
			if(_waitingForData)
			{
				return false;
			}

			_waitingForData = false;

			console.log("Getting weather data for", lat, lon);

			var requestURL = API_URL + "&lat=" + lat + "&lon=" + lon;

			atomic.get(requestURL)
			.success(apiRequestSuccess)
			.error(apiRequestError);
		}

		function locationSearchFormSubmitHandler (event, placeholderText) {
			event.preventDefault();

			if (_locationSearchInput.value !== "")
			{
				getWeatherDataFromLocationName(_locationSearchInput.value);
				placeholder = _locationSearchInput.value;
				_locationSearchSubmitWrapper.classList.add("loading");

				
				
				replacePlaceholder(placeholder);
				_locationSearchInput.value = "";
			}
			else
			{
				alert(MESSAGE_SEARCH_NOT_SPECIFIED);
			}
		}

		function replacePlaceholder (placeholder) {
			var placeholderText = _locationSearchInput.getAttribute("placeholder");
			
			_locationSearchInput.removeAttribute("placeholder");

			_locationSearchInput.setAttribute("placeholder", _locationSearchInput.value);


			// placeholderText = placeholder;

			// 	console.log(placeholder);
			// if (_locationSearchInput !== "") {

			// }
		}

		function getWeatherDataFromLocationName(locationName, lat, lon) {
			if(_waitingForData)
			{
				return false;
			}

			_waitingForData = false;

			console.log("Getting weather data...", locationName);

			var requestURL = API_URL + "&q=" + locationName;

			atomic.get(requestURL)
			.success(apiRequestSuccess)
			.error(apiRequestError);
		}

		function updateLocationDisplay (locationName, countryCode, temperature) {
			if(locationName !== "")
			{
				_locationNameDisplay.innerHTML = locationName + ", " + countryCode;
			}
			else 
			{
				_locationNameDisplay.innerHTML = countryCode;
			}

			_temperatureDisplay.innerHTML = temperature + UNITS;
		}

		function updateFlag (countryCode) {
			if (typeof _currentFlag !== "undefined")
			{
				_flag.classList.remove(_currentFlag);
			}
			
			_currentFlag = "icon-" + countryCode.toLowerCase();
			_flag.classList.add(_currentFlag);
		}

		function updateEmoji (temperature) {
			if (typeof _currentTemperatureClassName !== "undefined")
			{
				_emoji.classList.remove(_currentTemperatureClassName);
			}

			if (temperature <= TEMPERATURES.FREEZING.MAX)
			{
				_currentTemperatureClassName = TEMPERATURES.FREEZING.CLASS_NAME;
			}
			else if (temperature <= TEMPERATURES.COLD.MAX)
			{
				_currentTemperatureClassName = TEMPERATURES.COLD.CLASS_NAME;
			}
			else if (temperature <= TEMPERATURES.WARM.MAX)
			{
				_currentTemperatureClassName = TEMPERATURES.WARM.CLASS_NAME;
			}
			else if (temperature <= TEMPERATURES.HOT.MAX)
			{
				_currentTemperatureClassName = TEMPERATURES.HOT.CLASS_NAME;
			}

			_emoji.classList.add(_currentTemperatureClassName);
		}

		function getCurrentTime () {
			currentTime = new Date();
			time = currentTime.getTime();
			hours = currentTime.getHours();

			if (typeof _currentTimeClassName !== "undefined")
			{
				_timeContainer.classList.remove(_currentTimeClassName);
			}

			if (hours >= 17 ) {
				_currentTimeClassName = "icon-night";
				_timeContainer.setAttribute("right", "0 !important")
			}
			else 
			{
				_currentTimeClassName = "icon-day";
			}
			_timeContainer.classList.add(_currentTimeClassName);
		}
	}

}
