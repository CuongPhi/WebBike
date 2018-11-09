var socket ;
var map, marker,infowindow, geocoder;
const ZOOM_SIZE = 16;

var app = new Vue({
    el : '#app',
    data : {
        msg : "no msg",
        requests : [],
        LATLNG : { lat:10.7624176, lng: 106.6790081},
        LOGIN_SUCCESS : false
    },
    methods: {
        viewRide(){
            console.log('view ride');
        }
        ,
         timeConverter(UNIX_timestamp){
            var a = new Date(UNIX_timestamp * 1000);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
            var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
            var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
            return time;
          },
          initialize() {
            var self = this;
        //     if (navigator.geolocation) {
        //       navigator.geolocation.getCurrentPosition(function(position) {
        //           var pos = {
        //               lat: position.coords.latitude,
        //               lng: position.coords.longitude
        //           };
        //             self.LATLNG =pos;
                  
        //       }, function() {
        //         alert("We need to see your location !");
        //         //window.location.href='index.html'
        //       });
        //   } else {
        //       // Browser doesn't support Geolocation
        //   }                 
          var mapProp = {
            center: new google.maps.LatLng(self.LATLNG.lat, self.LATLNG.lng),
            zoom: ZOOM_SIZE,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            };
           geocoder = new google.maps.Geocoder();
           infowindow = new google.maps.InfoWindow();
     
            map = new google.maps.Map(
            document.getElementById("googleMap"),  mapProp);
            marker = new google.maps.Marker({
                position: self.LATLNG,
                map: map,
                draggable:true 
            });
            infowindow.open(map, marker); 
        },

        connect_to_server(){
            socket.on('event-driver-connecting',function(data){
                console.log(data)
             });
        }
    },
    created() {

    },
    mounted() {
      
        var self = this;
 
        google.maps.event.addDomListener(window, "load", self.initialize);

    },
});