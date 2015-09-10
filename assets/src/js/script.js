/*	Author: Yemi Kehinde
		wemoji-v2
*/

// --------------------------------------------- //
// DEFINE GLOBAL LIBS                            //
// --------------------------------------------- //
// Uncomment the line below to expose jQuery as a global object to the usual places
// window.jQuery = window.$ = require('../../../node_modules/jquery/dist/jquery.js');

var weather = require('./modules/weather');
var time = require('./modules/time');

document.addEventListener("DOMContentLoaded", function(){
	weather.init();
	time.init();
});
require("./libs/atomic");
