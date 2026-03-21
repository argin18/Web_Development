require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");

const PORT = process.env.PORT || 2000;
let server;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Server failed to start `, error);
    process.exit(1);
  }
};

const gracefulShutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log("Server closed. Process terminating");
    process.exit(0);
  });
};
// For server down Suddenly
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// For server terminate knowingly
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// For unhandle promise rejection
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection: ", err.message);
  server.close(() => process.exit(1));
});

// For uncaught exception error
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception: ", err.message);
  process.exit(1);
});

startServer();
