require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const hotelRoutes = require("./routes/hotelRoutes");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/hotels", hotelRoutes);

app.get("/", (req, res) => {
    res.send("Hotel Management API is running");
});

app.get("/api/hotel/db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.status(200).json({
            message: "Postgresql is Connected",
            time: result.rows[0].now
        });
    } catch (error) {
        console.error("Database error:", error.message);
        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log("Server running on port", port);
});