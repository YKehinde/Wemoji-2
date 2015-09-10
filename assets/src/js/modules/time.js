/*
TimeAPI.js
*/

module.exports = {

	//Needs to be global to be read in the init function and the desiplayZone function
	API_KEY: "453ZLOGPUTLR",
	ZONE :"AX",
	LAT :"51.5063721",
	LNG: "-0.1490095",
	FORMAT :"json",

	init: function  (url) {
		console.debug('Whats the time Mr. Wolf!');

		var API_URL_LATLNG = "http://api.timezonedb.com/?"+ "lat=" + this.LAT + "&lng=" + this.LNG + "&format=" + this.FORMAT + "&key=" + this.API_KEY ;
		var API_URL_ZONE = "http://api.timezonedb.com/?"+ "zone=" + this.ZONE + "&key=" + this.API_KEY ;
	},

	displayZone : function(lat, lng){
		var url = "http://api.timezonedb.com/?"+ "lat=" + lat + "&lng=" + lng + "&format=" + this.FORMAT + "&key=" + this.API_KEY ;

		console.log(url);

		atomic.get(url)
		.success(this.apiRequestSuccess)
		.error(this.apiRequestError);

	},

	apiRequestSuccess : function (data) {
		console.log('success ::' + data);

		var _TIMESTAMP = data.timestamp;
		var date = new Date(_TIMESTAMP*1000);
		var hours = date.getHours();
		var minutes = "0" + date.getMinutes();

		var localTime = hours + ':' + minutes.substr(-2);

		console.log(localTime);


		var _localTime = document.querySelector(".local-time");
		_localTime.innerHTML = localTime;
	},

	apiRequestError  : function(data) {
		console.log('error ::' + data);
	},

	
}
