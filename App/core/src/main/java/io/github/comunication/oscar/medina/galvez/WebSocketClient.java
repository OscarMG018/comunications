package io.github.comunication.oscar.medina.galvez;

import com.badlogic.gdx.Gdx;
import com.github.czyzby.websocket.WebSocket;
import com.github.czyzby.websocket.WebSocketListener;
import com.github.czyzby.websocket.WebSockets;

public class WebSocketClient implements WebSocketListener {
    private WebSocket socket;
    private boolean connected = false;
    private String lastResponse = null;
    private String response = null;

    public WebSocketClient(String url) {
        socket = WebSockets.newSocket(url);
        socket.addListener(this);
    }

    public void connect() {
        Gdx.app.log("WebSocketClient", "Connecting to WebSocket...");
        try {
            socket.connect();
            // Note: The actual connection happens asynchronously
            // The onOpen callback will be called when the connection is established
        } catch (Exception e) {
            Gdx.app.error("WebSocketClient", "Connection error: " + e.getMessage(), e);
        }
    }

    public void disconnect() {
        if (socket != null && socket.isOpen()) {
            socket.close();
        }
        connected = false;
    }

    public void send(String message) {
        if (isConnected()) {
            socket.send(message);
        }
    }

    public boolean isConnected() {
        return connected && socket != null && socket.isOpen();
    }

    public String getLatestResponse() {
        return response;
    }

    @Override
    public boolean onOpen(WebSocket webSocket) {
        Gdx.app.log("WebSocketClient", "WebSocket connected successfully!");
        connected = true;
        return false;
    }

    @Override
    public boolean onClose(WebSocket webSocket, int closeCode, String reason) {
        System.out.println("Closing...");
        connected = false;
        return false;
    }

    @Override
    public boolean onMessage(WebSocket webSocket, String packet) {
        Gdx.app.log("WebSocketClient", "Message received: " + packet);
        lastResponse = packet;
        return false;
    }

    @Override
    public boolean onMessage(WebSocket webSocket, byte[] packet) {
        System.out.println("Message:" + packet);
        return false;
    }

    @Override
    public boolean onError(WebSocket webSocket, Throwable error) {
        System.out.println("ERROR:" + error.toString());
        return false;
    }
}

