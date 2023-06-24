import "dotenv/config";
import express from "express";
import axios from "axios";

import { addLocation } from "./mongodb";
import { SLOTS_URL } from "./constants";
import { getCollection } from "./database";

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
