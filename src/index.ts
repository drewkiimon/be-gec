import axios from 'axios';
import 'dotenv/config';
import express from 'express';

import { SLOTS_URL } from './constants';
import { addLocation, getLocationCollection } from './mongodb';

import type { Collection, Document } from 'mongodb';

const app: express.Express = express();
const locationCollection: Collection<Document> | undefined =
  getLocationCollection();

app.get('/location/:locationId', async (req, res) => {
  const { locationId } = req.params ?? {};

  if (!locationId) {
    res.status(500);
    res.send('You fucked up');
  }

  const { data }: axios.AxiosResponse = await axios.get(SLOTS_URL, {
    params: {
      orderBy: 'soonest',
      limit: String(1),
      locationId,
      minimum: String(1),
    },
  });

  const appointment = data[0];
  const isAvailable =
    appointment?.locationId &&
    appointment?.startTimestamp &&
    appointment?.active;
  const result = isAvailable
    ? {
        locationId,
        time: data[0].startTimestamp,
      }
    : {};
  const location = {
    locationId,
    availableTime: appointment?.startTimestamp
      ? new Date(appointment.startTimestamp).toISOString()
      : null,
    isAppointmentAvailable: !!isAvailable,
  };

  addLocation({
    collection: locationCollection,
    location,
  });

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.send(result);
});

app.listen(process.env.PORT ?? 3000);
