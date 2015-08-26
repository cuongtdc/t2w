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
                  var lati0 = response.data.nearstations[0].lat;
                  var longi0 = response.data.nearstations[0].lon;
                  var ypos0 = Math.round((lati0 - latitude)*10000)/10;
                  var xpos0 = Math.round((longi0 - longitude)*10000)/10;
                  var leng0 = Math.hypot(xpos0,ypos0);
                  for (var i=2; i>=0; i--){
                    var namesta = response.data.nearstations[i].name;
                    var consta = response.data.nearstations[i].connections;
                    var dist = Math.round(response.data.nearstations[i].distance*1000);
                    var lati = response.data.nearstations[i].lat/leng0;
                    var longi = response.data.nearstations[i].lon/leng0;
                    var ypos = Math.round((lati - latitude)*10000)/10;
                    var xpos = Math.round((longi - longitude)*10000)/10;
                    Talk2Watch.sendSms(namesta + "\n" + consta + "\n" + dist + " m" + "\n" + "(" + xpos + "," + ypos + ")", "Nearest Metro Station "+ i);
                  }
                }
            }
        }
    };
    req.send(null);
}

window.navigator.geolocation.getCurrentPosition(locationSuccess,locationError);
