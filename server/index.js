require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectWithDB = require("./config/db");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;

connectWithDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// 1. CORS Middleware (Inhe Express ke dusre middlewares se pehle rakhein)
const isProduction = process.env.NODE_ENV === "production";

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Cookies & Headers allow karne ke liye
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());

// 2. Cookie Session (Local par secure: false rakhna zaruri hai)
app.use(
  cookieSession({
    name: "session",
    maxAge: (process.env.COOKIE_TIME || 3) * 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_SECRET || "secretkey"],
    secure: isProduction, // Localhost par false rahega, production par true
    sameSite: isProduction ? "none" : "lax", // Local par "lax" better kaam karta hai
    httpOnly: true,
  })
);

app.use(express.json());

app.use("/", require("./routes"));

app.listen(process.env.PORT || 4000, (err) => {
  if (err) {
    console.log("Error in connecting to server: ", err);
  }
  console.log(`Server is running on port no. ${process.env.PORT || 4000}`);
});

module.exports = app;