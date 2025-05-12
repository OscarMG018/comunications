'use strict';
class GameLogic {
    constructor(ws) {
        this.ws = ws;
    }


    handleMessage(id, msg) {
        try {
          let obj = JSON.parse(msg);
          if (!obj.type) return;
          let data = obj.data;
          switch (obj.type) {
            case "position":
                if (this.isValidPosition(data)) {
                    const response = {
                        status: 'valid',
                        message: `Position received: (${data.x}, ${data.y})`,
                        position: data
                    };
                    this.ws.broadcast(JSON.stringify(response));
                } else {
                    const response = {
                        status: 'invalid',
                        message: 'Invalid position'
                    };
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



