const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();
require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");

const port = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

   app.listen(port, () => {
    console.log("server is running.. on 3000 ");
  });
};

startServer()
