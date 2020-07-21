
module.exports = function(RED) {

    var WebSocket = require("ws")

    function sendMessage(message, send, endPoint){
        var socket = new WebSocket(endPoint);
            
        // console.log("criou o WebSocket")
        socket.onopen = function(e) {
            socket.send(JSON.stringify(message));
        };
        // console.log("enviou no WebSocket")
        socket.onmessage = function(event) {
            // console.log("recebeu do WebSocket")
            var message = {
                payload: event.data,
            }
            if(typeof(event.data) === "string"){
                message.payload = JSON.parse(event.data)
            }
            send(message)
        };
        socket.onclose = function(event) {
            if (event.wasClean) {
                console.log("Conexao fechada corretamente, code:" + event.code)
            } else {
                console.log("Conexao morta ou rede derrubada")
            }
        }
        socket.onerror = function(error) {
            console.log("Erro ao conectar WebSocket: ", error.message)
        };
    }

    function webSocketNode(config) {
        RED.nodes.createNode(this,config);

        this.name = config.name;
        this.port = config.port;
        this.url = config.url;

        this.endPoint = this.url + ":" + this.port;
        var node = this;

        node.on('input', function(msg, send, done) {
            var globalContext = node.context().global;
            // var exportMode = globalContext.get("exportMode");
            
            // if(!exportMode){
            var file = globalContext.get("exportFile")
                // var slot = globalContext.get("slot");
                // console.log(file.slots[slot].jig_test)
                // var exportFile = {
                //     "slots": [
                //         {
                //             "jig_test": [],
                //             "jig_error": []
                //         },
                //         {
                //             "jig_test": [],
                //             "jig_error": []
                //         },
                //         {
                //             "jig_test": [],
                //             "jig_error": []
                //         },
                //         {
                //             "jig_test": [],
                //             "jig_error": []
                //         },
                //     ],
                //     "tester": "",
                //     "model": ""
                // }
                // globalContext.set("exportFile", exportFile)
            sendMessage(file, send, node.endPoint)
                // send(msg)
            // }
            // else{
                // msg.payload = {
                    // "error": "Export mode is true"
                // }
            send(msg)
            // }
        });
    }
    RED.nodes.registerType("jig-web-socket", webSocketNode);
}
