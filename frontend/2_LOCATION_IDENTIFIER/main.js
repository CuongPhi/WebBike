var socket = null;
var app = new Vue({
    el : '#app',
    data : {
        msg : "no msg"
    },
    methods: {

    },
    created() {
        socket = io('http://localhost:1235');
    },
    mounted() {
        socket.on('event-request-reciever', function(rows){
            console.log(rows);
        });
      
    },
});