import express from "express";
import MapTodosController from "./controller/todoController";
import { config } from "dotenv";
import { GetEnv } from "./utils/env";
import { MongoClient } from "mongodb";
import bodyParser from "body-parser";

config();

const port = parseInt(GetEnv('PORT')) || 3001;
const app = express();
app.use(bodyParser.json())
app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
initialize();

app.listen(port, () =>
	console.log(`express server is listening on http://127.0.0.1:${port}`)
);


async function initialize() {
  const mongoClient = new MongoClient(GetEnv('MONGODB_CONN'));
  await mongoClient.connect();
  MapTodosController(app, mongoClient);
}