import axios from 'axios';
import express from 'express';

import { SLOTS_URL } from '../constants';
import {
  addLocation,
  getLocationCollection,
} from '../database/location-collection';

import type { Collection, Document } from 'mongodb';

const router: express.Router = express.Router({
  caseSensitive: true,
  strict: true,
});
const locationCollection: Collection<Document> | undefined =
  getLocationCollection();

router.get('/:locationId', async (req, res) => {
  const { locationId } = req.params ?? {};

  if (locationId === undefined) {
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
    appointment?.locationId !== undefined &&
    appointment?.startTimestamp !== undefined &&
    appointment?.active !== undefined &&
    true;

  const result = isAvailable
    ? {
        locationId,
        time: data[0].startTimestamp,
      }
    : {};
  const location = {
    locationId,
    availableTime:
      appointment?.startTimestamp !== undefined
        ? new Date(appointment.startTimestamp).toISOString()
        : null,
    isAppointmentAvailable: !!isAvailable,
  };

  await addLocation({
    collection: locationCollection,
    location,
  });

  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE, PUT',
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept',
  });

  res.send(result);
});

export default router;
