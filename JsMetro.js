function locationSuccess(pos) {
  var coordinates = pos.coords;
  fetchWeather(coordinates.latitude, coordinates.longitude);
}

function locationError(err) {

}

function fetchWeather(latitude, longitude) {
    var response;
    var req = new XMLHttpRequest();
    var url = "http://barcelonaapi.marcpous.com/metro/nearstation/latlon/"+ latitude + "/" +longitude +"/1.json";

    req.open('GET', url, true);
    req.onload = function(e) {

        if (req.readyState == 4) {
            if (req.status == 200) {
                response = JSON.parse(req.responseText);
                if (response) {
                    var temp = response.data.nearstations[1].name;
                    Talk2Watch.sendSms(temp, "Weather in " + response.code);
                }
            }
        }
    };
    req.send(null);
}

window.navigator.geolocation.getCurrentPosition(locationSuccess,locationError);
