var socket = io("http://localhost:1235");
var map, marker,infowindow, geocoder;
const ZOOM_SIZE = 16;

var app = new Vue({
    el : '#app',
    data : {
        msg : "no msg",
        requests : []
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
            var mapProp = {
              center: new google.maps.LatLng(10.762467, 106.682751),
              zoom: ZOOM_SIZE,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            };
             geocoder = new google.maps.Geocoder();
             infowindow = new google.maps.InfoWindow();
            document.getElementById("submit").addEventListener("click", function() {
              var address = document.getElementById("address").value;
              self.geocodeAddress(geocoder,address, map);
              
            });
              map = new google.maps.Map(
              document.getElementById("googleMap"),  mapProp);
              marker = new google.maps.Marker({
                  position: {
                      lat : 10.762467, 
                      lng: 106.682751
                  },
                  map: map,
                  draggable:true 
              });
              infowindow.open(map, marker);
      
              marker.addListener('dragend', function(){
                  console.log('rever')
                  self.geocodeLatLng(geocoder, map, {
                      lat: marker.position.lat(),
                      lng: marker.position.lng()
                  } );
              });
          }
    },
    created() {

    },
    mounted() {
        //socket = io('http://localhost:1235');
        var self = this;
        socket.on('event-request-management', function(rows){
            self.requests = JSON.parse(rows);
            self.requests.sort(function(a, b) {
              return b.iat - a.iat;
            });
            self.requests.forEach(e => {
              e.date = self.timeConverter(e.iat);
              e.note_trim = e.note.substr(0, 30);
              switch(e.status){
                case 0:
                e.status_string = 'Chưa định vị'; 
                break;
                case 1:
                e.status_string = 'Đã định vị'; 
                break;
                case 2:
                e.status_string = 'Đã có xe nhận'; 
                break;
                case 3:
                e.status_string = 'Đang di chuyển'; 
                break;
                case 4:
                e.status_string = 'Hoàn thành'; 
                break;
              }
            });           
        });
        google.maps.event.addDomListener(window, "load", self.initialize);

    },
});