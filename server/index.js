require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./db/connection");
const { configureCloudinary } = require("./services/cloudinaryService");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const app = express();

const PORT = process.env.PORT || 4000;

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) =>
  res.json({ ok: true, message: "Wyo server running" })
);

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

async function start() {
  try {
    if (!process.env.MONGO_URI) {
      console.warn(
        "MONGO_URI not set - skipping DB connect (use .env to configure)"
      );
    } else {
      await connectDB(process.env.MONGO_URI);
    }

    configureCloudinary();

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

start();
