function testfunction() {
    document.getElementById("testbar").classList.toggle("testchange");
}

var script = document.createElement('script');
script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBga0VE2nivvRnW_v2-I7dbxafd3HDNy2c&";
document.getElementsByTagName('head')[0].appendChild(script);

script.onload = function() {
    var koordinaadid = {lat: 58.828921, lng: 25.139831};

    var mapProp = {
        center: new google.maps.LatLng(koordinaadid),
        zoom: 5,
    };

    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    var marker2 = new google.maps.Marker({
        position: koordinaadid,
        map: map,
        title: 'Käru'
    });

    var marker1 = new google.maps.Marker({
        position: {lat: 58.908015, lng: 24.945909},
        map: map,
        title: 'Ohekatku'
    });
};