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
                  for (var i=2; i>=0; i--){
                    var namesta = response.data.nearstations[i].name;
                    var consta = response.data.nearstations[i].connections;
                    var diststr = response.data.nearstations[i].distance;
                    var dist = (Float.valueOf(diststr)).floatValue();
                    Talk2Watch.sendSms(namesta + "\n" + consta + "\n" + Math.round(dist*100) + " m", "Nearest Metro Station "+ i);
                  }
                }
            }
        }
    };
    req.send(null);
}

window.navigator.geolocation.getCurrentPosition(locationSuccess,locationError);
