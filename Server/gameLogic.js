'use strict';
class GameLogic {
    constructor(ws) {
        this.ws = ws;
    }


    handleMessage(id, msg) {
        try {
          console.log("Received message:", msg);
          let obj = JSON.parse(msg);
          if (!obj.type) {
              console.log("Message has no type");
              return;
          }
          console.log("Message type:", obj.type);
          let data = obj.data;
          switch (obj.type) {
            case "position":
                console.log("Processing position message:", data);
                const response = {
                    status: 'valid',
                    message: `Position received: (${data.x}, ${data.y})`,
                    position: data
                };
                console.log("Broadcasting valid position:", response);
                this.ws.broadcast(JSON.stringify(response));
                break;
            default:
                break;
          }
        } catch (error) {}
    }
}

module.exports = GameLogic;



