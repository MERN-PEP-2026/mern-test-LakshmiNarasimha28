import express from "express";
import authRoutes from "./routes/authroutes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

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

export default app;