var socket = io('http://localhost:1235');

var app = new Vue({
    el : '#app',
    data : {
        msg : "no msg",
        requests : []
    },
    methods: {
        changeStt(_id){
            console.log(_id);            
            // socket.emit('event-change-stt-to-1', JSON.stringify({
            //     id : _id,
            //     status : 1
            // }));
        },
        timeConverter(UNIX_timestamp){
            var a = new Date(UNIX_timestamp * 1000);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getFullYear();var month = months[a.getMonth()];
            var date = a.getDate(); var hour = a.getHours();var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
            var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
            return date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
          },
          geocodeAddress(geocoder, resultsMap) {
            var address = document.getElementById('address').value;
            geocoder.geocode({'address': address}, function(results, status) {
              if (status === 'OK') {
                resultsMap.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                  map: resultsMap,
                  position: results[0].geometry.location
                });
              } else {
                alert('Geocode was not successful for the following reason: ' + status);
              }
            });
          },
          initialize() {
              var self = this;
            var mapProp = {
              center:new google.maps.LatLng(10.762467, 106.682751),
              zoom: 16,
              mapTypeId:google.maps.MapTypeId.ROADMAP
            };
            var geocoder = new google.maps.Geocoder();
            document.getElementById('submit').addEventListener('click', function() {
                self.geocodeAddress(geocoder, map);
            });
            var map =new google.maps.Map(document.getElementById("googleMap"), mapProp);
          },
          
    },
    created() {
        var self = this;
        socket.on('event-change-stt-to-1-ok', function(req){
            var _req = JSON.parse(req);
            self.requests.forEach((e, index, object) => {
                if(e.id ==  _req.id){
                    object.splice(index, 1);
                }
            });
        });
    },
    mounted() {
        //socket = io('http://localhost:1235');
        var self = this;
        socket.on('event-request-reciever', function(rows){
            self.requests = JSON.parse(rows);
            self.requests.sort(function(a,b){
                return b.iat - a.iat;
            });
            self.requests.forEach(e => {
                e.date = self.timeConverter(e.iat);
            });
        });
        google.maps.event.addDomListener(window, 'load', self.initialize);

    }
});