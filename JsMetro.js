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
                  var ypos0 = lati0 - latitude;
                  var xpos0 = longi0 - longitude;
                  var leng0 = Math.sqrt(Math.pow(xpos0,2)+Math.pow(ypos0,2));
                  for (var i=2; i>=0; i--){
                    var namesta = response.data.nearstations[i].name;
                    var consta = response.data.nearstations[i].connections;
                    var dist = Math.round(response.data.nearstations[i].distance*1000);
                    var lati = response.data.nearstations[i].lat;
                    var longi = response.data.nearstations[i].lon;
                    var ypos = Math.round(((lati - latitude)/leng0)*10)/10;
                    var xpos = Math.round(((longi - longitude)/leng0)*10)/10;
                    var ang = Math.round(Math.atan2(ypos,xpos)*180/Math.PI);
                    if (ang-90<0) {var ang = -ang+90;} else {var ang = ang-90;}
                    Talk2Watch.sendSms(namesta + "\n" + consta + "\n" + "Polar: (" + dist + " m," + ang + " d)" + "\n" + "(" + xpos + "," + ypos + ")", "Nearest Metro Station "+ i);
                  }
                }
            }
        }
    };
    req.send(null);
}

window.navigator.geolocation.getCurrentPosition(locationSuccess,locationError);
