import "dotenv/config";
import express from "express";
import axios from "axios";
import { MongoClient, ServerApiVersion } from "mongodb";
import type { Collection, Document } from "mongodb";

import { addLocation } from "./mongodb";
import { SLOTS_URL } from "./constants";

const { DB_URI, DB_NAME, COLLECTION_NAME } = process.env ?? {};

const client = new MongoClient(String(DB_URI), {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const getCollection = async (): Promise<Collection<Document> | undefined> => {
  try {
    await client.connect();
    const database = client.db(String(DB_NAME));
    const collection = database.collection(String(COLLECTION_NAME));
    console.log("Connected to database and collection");
    return collection;
  } catch (err) {
    console.log("Error when connecting to collection");
    client.close();
  }
};

const app: express.Express = express();

getCollection().then((collection) => {
  app.get("/location/:locationId", async (req, res) => {
    const { locationId } = req.params ?? {};

    if (!locationId) {
      res.status(500);
      res.send("You fucked up");
    }

    const { data }: axios.AxiosResponse = await axios.get(SLOTS_URL, {
      params: {
        orderBy: "soonest",
        limit: String(1),
        locationId,
        minimum: String(1),
      },
    });

    const appointment = data[0];
    const isAvailable =
      appointment &&
      appointment?.locationId &&
      appointment?.startTimestamp &&
      appointment?.active;

    const result = isAvailable
      ? {
          locationId,
          time: data[0].startTimestamp,
        }
      : {};

    addLocation({
      collection,
      locationId,
      availableTime: appointment?.startTimestamp
        ? new Date(appointment.startTimestamp).toISOString()
        : null,
      isAppointmentAvailable: !!isAvailable,
    });

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "DELETE, PUT");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.send(result);
  });

  app.listen(process.env.PORT ?? 3000);
});
