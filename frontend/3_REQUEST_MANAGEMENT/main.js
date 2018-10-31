var socket = io('http://localhost:1235');

var app = new Vue({
    el : '#app',
    data : {
        msg : "no msg",
        requests : []
    },
    methods: {
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
          }
    },
    created() {

    },
    mounted() {
        //socket = io('http://localhost:1235');
        var self = this;
        socket.on('event-request-management', function(rows){
            self.requests = JSON.parse(rows);
            self.requests.sort(function(a,b){
                return b.iat - a.iat;
            });
            self.requests.forEach(e => {
                e.date = self.timeConverter(e.iat);
            });
           
        });
    },
});