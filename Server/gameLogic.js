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
                if (this.isValidPosition(data)) {
                    const response = {
                        status: 'valid',
                        message: `Position received: (${data.x}, ${data.y})`,
                        position: data
                    };
                    console.log("Broadcasting valid position:", response);
                    this.ws.broadcast(JSON.stringify(response));
                } else {
                    const response = {
                        status: 'invalid',
                        message: 'Invalid position'
                    };
                    console.log("Broadcasting invalid position:", response);
                    this.ws.broadcast(JSON.stringify(response));
                }
                break;
            default:
                break;
          }
        } catch (error) {}
    }

    isValidPosition(position) {
        if (position && 
            typeof position.x === 'number' && 
            typeof position.y === 'number' &&
            !isNaN(position.x) && 
            !isNaN(position.y)) {
          return true;
        }
        return false;
    }
}

module.exports = GameLogic;



