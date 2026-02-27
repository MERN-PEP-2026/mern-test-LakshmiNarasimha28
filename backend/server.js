import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
io.on("connection", (socket) => {
    console.log("New client connected: " + socket.id);
    socket.on("disconnect", () => {
        console.log("Client disconnected: " + socket.id);
    }
    );
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

