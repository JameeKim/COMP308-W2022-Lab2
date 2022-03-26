import path from "path";

import { config } from "dotenv"; // eslint-disable-line import/order
import { projectDir } from "./config/paths"; // eslint-disable-line import/order

const dotenvPath = path.resolve(projectDir, ".env.local");
const publicAssetsDir = path.resolve(projectDir, "client", "build");
const indexHtmlPath = path.resolve(publicAssetsDir, "index.html");

config({ path: dotenvPath });

import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

import getEnv from "./config/env";
import { resolvers, typeDefs } from "./controllers/graphql";
import routes from "./routes";

// Connection to the database
mongoose.connect(getEnv().DB_URI, (error) => {
  if (error) {
    console.error("Failed to connect to mongodb");
    console.error(error);
  } else {
    console.log("Connection to mongodb established");
  }
});

async function startServer(): Promise<void> {
  // Express app configuration
  const app = express();
  app.disable("x-powered-by");

  // Middlewares
  app.use(morgan("tiny"));

  // Static files
  // eslint-disable-next-line import/no-named-as-default-member
  app.use(express.static(publicAssetsDir, {
    maxAge: process.env.NODE_ENV === "production" ? "1d" : 0,
  }));

  // Set up routes
  app.use(routes);

  // Apollo GraphQL server
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });
  await apollo.start();
  apollo.applyMiddleware({ app, disableHealthCheck: true });

  // Catch-all routes to send the index.html
  app.get("*", (req, res, next) => {
    if (req.accepts("html")) {
      res.sendFile(indexHtmlPath);
    } else {
      next();
    }
  });

  const port = process.env.PORT || 5000;
  await new Promise<void>(resolve => app.listen(port, resolve));
  console.log(`Express server listening on port ${port}`);
}

startServer();
