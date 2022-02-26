import path from "path";

import { config } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

import getEnv from "./config/env";
import routes from "./routes";

const projectDir = path.resolve(__dirname, "..", "..");
const dotenvPath = path.resolve(projectDir, ".env.local");
const publicAssetsDir = path.resolve(projectDir, "client", "build");

config({ path: dotenvPath });

// Connection to the database
mongoose.connect(getEnv().DB_URI, (error) => {
  if (error) {
    console.error("Failed to connect to mongodb");
    console.error(error);
  } else {
    console.log("Connection to mongodb established");
  }
});

// Express app configuration
const app = express();
app.disable("x-powered-by");

// Middlewares
app.use(morgan("tiny"));

// Static files
// eslint-disable-next-line import/no-named-as-default-member
app.use(express.static(publicAssetsDir));

// Set up routes
app.use(routes);

// Catch-all routes to send the index.html
app.all("*", (_req, res) => {
  res.sendFile(path.resolve(publicAssetsDir, "index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
