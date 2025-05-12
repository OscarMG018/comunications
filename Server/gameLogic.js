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
                console.log("Processing position message from client:", id);
                console.log("Position data:", data);
                const response = {
                    type: "position_update",
                    status: 'valid',
                    message: `Position received: (${data.x}, ${data.y})`,
                    position: data,
                    clientId: id
                };
                console.log("Broadcasting position update:", JSON.stringify(response));
                this.ws.broadcast(JSON.stringify(response));
                console.log("Broadcast complete");
                break;
            default:
                console.log("Unknown message type:", obj.type);
                break;
          }
        } catch (error) {
            console.error("Error handling message:", error);
        }
    }
}

module.exports = GameLogic;



