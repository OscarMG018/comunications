package io.github.comunication.oscar.medina.galvez;

import com.badlogic.gdx.ApplicationAdapter;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.math.Vector2;
import com.badlogic.gdx.utils.Json;
import com.badlogic.gdx.utils.JsonReader;
import com.badlogic.gdx.utils.JsonValue;

public class Main extends ApplicationAdapter {
    private SpriteBatch batch;
    private BitmapFont font;
    private WebSocketClient webSocketClient;
    private String serverResponse = "Touch the screen to send position";
    private Vector2 lastPosition = new Vector2(-1, -1);
    private final Json json = new Json();

    @Override
    public void create() {
        batch = new SpriteBatch();
        font = new BitmapFont();
        font.getData().setScale(2);
        webSocketClient = new WebSocketClient("wss://bandera1.ieti.site:443");
        webSocketClient.connect();
    }

    @Override
    public void render() {
        // Clear the screen
        Gdx.gl.glClearColor(0.2f, 0.2f, 0.2f, 1);
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);

        // Check for touch input
        if (Gdx.input.isTouched()) {
            // Get touch position
            float x = Gdx.input.getX();
            float y = Gdx.input.getY();

            // Convert to world coordinates (LibGDX Y is inverted)
            y = Gdx.graphics.getHeight() - y;

            // Check if this is a new position (avoid sending duplicates)
            if (lastPosition.x != x || lastPosition.y != y) {
                lastPosition.set(x, y);

                // Send position to server if connected
                if (webSocketClient.isConnected()) {
                    Position position = new Position(x, y);
                    String message = String.format("{\"type\": \"position\", \"data\": {\"x\": %f, \"y\": %f}}", position.x, position.y);
                    webSocketClient.send(message);
                }
            }
        }

        // Update server response if available
        String response = webSocketClient.getLatestResponse();
        if (response != null) {
            try {
                // Try to parse the response as JSON
                JsonValue jsonResponse = new JsonReader().parse(response);
                String status = jsonResponse.getString("status");
                String message = jsonResponse.getString("message");
                serverResponse = status + ": " + message;
            } catch (Exception e) {
                // If parsing fails, just show the raw response
                serverResponse = response;
            }
        }

        // Draw UI
        batch.begin();
        font.draw(batch, "Touch position: " + lastPosition.x + ", " + lastPosition.y, 50, Gdx.graphics.getHeight() - 50);
        font.draw(batch, "Server response: " + serverResponse, 50, Gdx.graphics.getHeight() - 100);
        font.draw(batch, "Connection status: " + (webSocketClient.isConnected() ? "Connected" : "Disconnected"), 50, Gdx.graphics.getHeight() - 150);
        batch.end();
    }

    @Override
    public void dispose() {
        batch.dispose();
        font.dispose();
    }

    // Position class for sending to server
    static class Position {
        public float x;
        public float y;

        public Position(float x, float y) {
            this.x = x;
            this.y = y;
        }
    }
}
