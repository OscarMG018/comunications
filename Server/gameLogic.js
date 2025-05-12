'use strict';
const fs = require('fs');
const SPEED = 1.2;
const INITIAL_HEALTH = 100;
const INITIAL_ATTACK = 10;
const INITIAL_DEFENSE = 5;
const MAP_SIZE = { width: 32, height: 16 };

const DIRECTIONS = {
    "up":         { dx: 0, dy: -1 },
    "left":       { dx: -1, dy: 0 },
    "down":       { dx: 0, dy: 1 },
    "right":      { dx: 1, dy: 0 },
    "none":       { dx: 0, dy: 0 },
};
const Player = require('./player.js');

class GameLogic {
    constructor(ws) {
        this.clients = [];
        this.ws = ws;
    }

    addClient(id) {
        this.clients.push(id);
    }

    removeClient(id) {
        this.players.splice(this.clients.indexOf(id), 1);
    }

    handleMessage(id, msg) {
        try {
          let obj = JSON.parse(msg);
          if (!obj.type) return;
          let player = this.players.get(id);
          if (!player) return;
          let data = obj.data;
          switch (obj.type) {
            case "position":
                if (isValidPosition(data)) {
                    const response = {
                        status: 'valid',
                        message: `Position received: (${data.x}, ${data.y})`,
                        position: data
                    };
                    this.ws.send(JSON.stringify(response));
                } else {
                    const response = {
                        status: 'invalid',
                        message: 'Invalid position'
                    };
                    this.ws.send(JSON.stringify(response));
                }
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



