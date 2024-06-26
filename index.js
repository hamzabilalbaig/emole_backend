const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { sequelizeServer } = require("./src/config/sequelize.config");
var initModels = require("./src/models/init-models");
const cors = require("cors");
// !important!
// you need to install the following libraries |express|[dotenv > if required]
// or run this command >> npm i express dotenv
var models = initModels(sequelizeServer);
try {
  sequelizeServer.authenticate().then(() => {
    console.log("Connection has been established successfully.");
  });
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Access-Control-Allow-Headers,token"
//   );

//   next();
// });

app.use(
  cors({
    origin: "*", // Specify your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
    credentials: true, // Allow credentials (cookies, tokens, etc.)
  })
);

var userRoutes = require("./src/routes/User.routes");
var productRoutes = require("./src/routes/Products.routes");
var websiteRoutes = require("./src/routes/Websites.routes");
var planRoutes = require("./src/routes/Plans.routes");
var segmentRoutes = require("./src/routes/Segments.routes");
var alertRoutes = require("./src/routes/Alerts.routes");

app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", websiteRoutes);
app.use("/api", planRoutes);
app.use("/api", segmentRoutes);
app.use("/api", alertRoutes);

app.get("/", (req, res) => {
  res.send("hello from simple server :)");
});

app.listen(port, () =>
  console.log("> Server is up and running on port : " + port)
);
