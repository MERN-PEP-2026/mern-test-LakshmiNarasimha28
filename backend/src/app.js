import express from "express";
import authRoutes from "./routes/authroutes.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import courseRoutes from "./routes/courseroutes.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:8080",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "Welcome to the CMS API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

export const notFound = (req, res, next) => {   
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
};

export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Server error",
    });
};

export default app;