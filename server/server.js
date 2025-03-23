require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    transports: ["websocket", "polling"],
    cors: { origin: process.env.CLIENT_URI, methods: ["GET"] },
});

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    title: String,  // Changed from 'email' to 'title'
    message: String,
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// WebSocket Connection
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("formData", async (data) => {
        try {
            const newUser = new User(data);
            await newUser.save();
            console.log("User data saved:", data);
            socket.emit("success", { message: "Data saved successfully!" });
        } catch (err) {
            socket.emit("error", { message: "Failed to save data!" });
        }
    });

    socket.on("disconnect", () => console.log("User disconnected"));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
