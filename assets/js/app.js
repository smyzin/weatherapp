var getLocation = {};
var weatherLoc = {};
var geoPosition, btnText = 'Show information';

var date = new Date();
date.setTime(date.getTime() + (10 * 60 * 1000));

var listInfo = ['Country', 'Region', 'City', 'IP', 'Latitude', 'Longitude'];
var listWeather = ['Temperature', 'Brief summary', 'Wind Speed', 'Pressure', 'Code', 'Humidity', 'Icon'];
var listInfoLi = listInfo.map(function(el, i){
	var lowLi = el.toLowerCase();
	return (
		<main key={'li_' + i} className="info-block" id={'block_' + lowLi}>
			<div>
				<span>{el + ' - '}</span>
				<span id={lowLi}></span>
			</div>
		</main>
	);
});
var listWeatherLi = listWeather.map(function(el, i){
	var lowLi = el.toLowerCase();
	return (
		<main key={'li_' + i} className="info-block" id={'block_' + lowLi.replace(' ', '')}>
			<div>
				<span>{el + ': '}</span>
				<span id={lowLi.replace(' ', '')}></span>
			</div>
		</main>
	);
});

var ulList = (
	<div>
		<section>{listInfoLi}</section>
		<section>{listWeatherLi}</section>
	</div>
	);
ReactDOM.render(ulList, document.getElementById('app_body'));



if($.cookie('information') != undefined){
	var city;
	getLocation = JSON.parse($.cookie('information'));
	for(var k in getLocation){

		if(k == "city"){
			city = getLocation[k];
		}

		ReactDOM.render(<block>{getLocation[k]}</block>, document.getElementById(k));
	};
	console.log('Take from cookie "info"');
	if($.cookie('weather') != undefined){
		weatherLoc = JSON.parse($.cookie('weather'));
		for(var k in weatherLoc){
			switch(k){
				case 'temperature':
					ReactDOM.render(<block>{weatherLoc[k] + "°"}</block>, document.getElementById(k));
					break;
				case 'windspeed':
					ReactDOM.render(<block>{weatherLoc[k]}<img id='wind-ico' src='https://raw.githubusercontent.com/stephenhutchings/typicons.font/master/src/png-24px/weather-windy-cloudy.png' /></block>, document.getElementById(k));
					break;
				case 'pressure':
					ReactDOM.render(<block>{weatherLoc[k]}<img id='therm-ico' src='https://raw.githubusercontent.com/stephenhutchings/typicons.font/master/src/png-24px/thermometer.png' /></block>, document.getElementById(k));
					break;
				default:
					ReactDOM.render(<block>{weatherLoc[k]}</block>, document.getElementById(k));
					break;
			};
		};
		console.log('Take from cookie "weather"');
		weatherIcon(weatherLoc.icon);
	}else{
		getWeather(city);
	}
}else{
	getInfo();
}


function getInfo(){
	$.getJSON('http://ipinfo.io/json?callback=', function(data){
		getLocation = {
			"ip" : data.ip,
			"city" : data.city,
			"country" : data.country,
			"region" : data.region,
			"latitude" : data.loc.split(',')[0],
			"longitude" : data.loc.split(',')[1]
		};
		if(data){
			for(var k in getLocation){
				ReactDOM.render(<block>{getLocation[k]}</block>, document.getElementById(k));
			};
			getWeather(data.city);
			console.log('Create cookie "info"');
			$.cookie('information', JSON.stringify(getLocation), {expires: date});
		}else{
			var locationError = (
				<main>
					<i aria-hidden="true" className="fa fa-hand-paper-o fa-2x" style="color: #85144B;"></i>
					<h3 id='error'>Oops ... !</h3>
					<p id='errorDet'>It seams You use AdBlock. Please, switch it off to make magic happen</p>
				</main>
			);
			ReactDOM.render(locationError, document.getElementById('result'));
		};
	});
}

function getWeather(city){
	$.getJSON("http://api.apixu.com/v1/current.json?key=4d9abc9cbe7d4fe5b22144107162308&q=" + city, function(data){
		weatherLoc = {
			// "timezone" : data.location.tz_id,
			"briefsummary" : data.current.condition.text,
			"temperature" : data.current.temp_c,
			"windspeed" : data.current.wind_kph,
			"code": data.current.condition.code,
			"pressure" : data.current.pressure_mb,
			"humidity" : data.current.humidity
		};
		switch(weatherLoc.code){
			case 1000:
				weatherLoc.icon = 'CLEAR_DAY';
				break;
			case 1003:
				weatherLoc.icon = 'PARTLY_CLOUDY_DAY';
				break;
			case 1006:
			case 1009:
				weatherLoc.icon = 'CLOUDY';
				break;
			case 1030:
			case 1135:
			case 1147:
				weatherLoc.icon = 'FOG';
				break;
			case 1063:
			case 1087:
			case 1180:
			case 1183:
			case 1186:
			case 1189:
			case 1192:
			case 1195:
			case 1198:
			case 1201:
			case 1237:
			case 1240:
			case 1243:
			case 1246:
			case 1261:
			case 1264:
			case 1273:
			case 1276:
				weatherLoc.icon = 'RAIN';
				break;
			case 1069:
			case 1072:
			case 1150:
			case 1153:
			case 1168:
			case 1171:
			case 1204:
			case 1207:
			case 1249:
			case 1252:
				weatherLoc.icon = 'SLEET';
				break;
			case 1066:
			case 1114:
			case 1117:
			case 1210:
			case 1213:
			case 1216:
			case 1219:
			case 1222:
			case 1225:
			case 1255:
			case 1258:
			case 1279:
			case 1282:
				weatherLoc.icon = 'SNOW';
				break;

			default:
				weatherLoc.icon = 'PARTLY_CLOUDY_NIGHT';
				break;
		}
		if(data){
			for(var k in weatherLoc){
				switch(k){
					case 'temperature':
						ReactDOM.render(<block>{weatherLoc[k] + "°"}</block>, document.getElementById(k));
						break;
					case 'windspeed':
						ReactDOM.render(<block>{weatherLoc[k]}<img id='wind-ico' src='https://raw.githubusercontent.com/stephenhutchings/typicons.font/master/src/png-24px/weather-windy-cloudy.png' /></block>, document.getElementById(k));
						break;
					case 'pressure':
						ReactDOM.render(<block>{weatherLoc[k]}<img id='therm-ico' src='https://raw.githubusercontent.com/stephenhutchings/typicons.font/master/src/png-24px/thermometer.png' /></block>, document.getElementById(k));
						break;
					default:
						ReactDOM.render(<block>{weatherLoc[k]}</block>, document.getElementById(k));
						break;
				};
			};
			console.log('Create cookie "weather"');
			weatherIcon(weatherLoc.icon);
			$.cookie('weather', JSON.stringify(weatherLoc), {expires: date});
		}else{
			var weatherError = (
				<main>
					<h3 id='error'>Oops ... !</h3>
					<p id='errorDet'>The weather station closed for renovation. Please, try again later</p>
				</main>
			);
			ReactDOM.render(weatherError, document.getElementById('app_body'));
		};

	});
}

function weatherIcon(ico){
	switch(ico){
		case 'CLEAR_DAY':
			icons.set("weather-icon", Skycons.CLEAR_DAY);
			break;
		case 'PARTLY_CLOUDY_DAY':
			icons.set("weather-icon", Skycons.PARTLY_CLOUDY_DAY);
			break;
		case 'CLOUDY':
			icons.set("weather-icon", Skycons.CLOUDY);
			break;
		case 'FOG':
			icons.set("weather-icon", Skycons.FOG);
			break;
		case 'RAIN':
			icons.set("weather-icon", Skycons.RAIN);
			break;
		case 'SLEET':
			icons.set("weather-icon", Skycons.SLEET);
			break;
		case 'SNOW':
			icons.set("weather-icon", Skycons.SNOW);
			break;
		default:
			icons.set("weather-icon", Skycons.PARTLY_CLOUDY_NIGHT);
			break;
	}
	$('#header_card').css('background-image', 'url(assets/img/' + ico.toLowerCase() + '.jpg)');
	icons.play();
}


// function clickEl(){
// 	if($('.button_btn').hasClass('active')){
// 		$('.button_btn').removeClass('active');
// 		btnText = 'Show information';
// 		geoPosition = (<div><p></p></div>);
// 	}else{
// 		$('.button_btn').addClass('active');
// 		btnText = 'Hide information';
// 		console.log(weatherLoc.icon);
// 		// skycons.add("icon1", Skycons.iconSet);
// 		geoPosition = (
// 			<div>
// 				<h1>Your information block</h1>
// 				<div id="left-block">
// 					<p>
// 						Time zone - <span>{weatherLoc.timezone}</span><br />
// 						Weather - <span>{weatherLoc.summary}</span><br />
// 						Temperature - <span>{weatherLoc.temperature}</span><br />
// 						Wind Speed - <span>{weatherLoc.windSpeed}</span><br />
// 						Code - #<span>{weatherLoc.code}</span><br />
// 						Pressure - <span>{weatherLoc.pressure}</span><br />
// 						Humidity - <span>{weatherLoc.humidity}</span><br />
// 					</p>
// 				</div>
// 				<div id="right-block">
// 					<p>
// 						IP - <span>{getLocation.ip}</span><br />
// 						Country - <span>{getLocation.country}</span><br />
// 						City - <span>{getLocation.city}</span><br />
// 						Region - <span>{getLocation.region}</span><br />
// 						Latitude - <span>{getLocation.latitude}</span><br />
// 						Longitude - <span>{getLocation.longitude}</span>
// 					</p>
// 				</div>
// 			</div>
// 		);
// 	};

// 	ReactDOM.render(geoPosition, document.getElementById('result'));
// 	setTimeout(function(){
// 		var iconSet = weatherLoc.icon;
// 		console.log(iconSet);
// 		skycons.add("icon1", Skycons.iconSet);
// 		skycons.play();
// 	}, 1500);
// 	// ReactDOM.render(<a href="#" className="button_btn" onClick={clickEl}>{btnText}</a>, document.getElementById('app'));


// }

// ReactDOM.render(<a href="#" className="button_btn" onClick={clickEl}>{btnText}</a>, document.getElementById('app'));
