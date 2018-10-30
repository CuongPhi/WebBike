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
            socket.emit('event-change-stt-to-1', JSON.stringify({
                id : _id,
                status : 1
            }));
        }
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
        });
    },
});