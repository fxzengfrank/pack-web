var websocket;

function connectWS() {
    websocket = new WebSocket("ws://127.0.0.1:9080/wsapi");
    websocket.onerror = function() {
        websocket.close();
    }
    websocket.onclose = function() {
        connectWS();
    }
    websocket.onmessage = function(evt) {
        console.log(evt.data);
        switch (evt.data) {
            case 'page1':
                vm.activepage = 'page1'
                break;
            case 'page2':
                vm.activepage = 'page2'
                break;
            default:
                console.log('switch to default')
                break;
        }
    }
}

connectWS();

var vm = new Vue({
    el: '#app',
    data: {
        activepage: 'page2',
        pagedata: {
            page1: 'DATA1',
            page2: 'DATA2'
        }
    },
    methods: {
        page1: function() {
            this.activepage = 'page1'
        },
        page2: function() {
            this.activepage = 'page2'
        }
    }
});