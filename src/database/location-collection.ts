import 'dotenv/config';

import client from './client';

import type { Collection, Document } from 'mongodb';

const { DB_NAME, COLLECTION_NAME } = process.env ?? {};

const getLocationCollection = (): Collection<Document> | undefined => {
  try {
    const database = client.db(String(DB_NAME));
    const collection = database.collection(String(COLLECTION_NAME));
    console.log('Connected to database and collection');
    return collection;
  } catch (err) {
    client
      .close()
      .then(() => {
        console.log('Error when connecting to collection');
      })
      .catch((err) => {
        if (typeof err === 'string') {
          console.log(`Error when closing collection: ${err}`);
        }
      });
  }
};

interface LocationSchema {
  locationId: string;
  availableTime: string | null;
  isAppointmentAvailable: boolean;
}
interface Params {
  collection: Collection<Document> | undefined;
  location: LocationSchema;
}
const addLocation = async ({ collection, location }: Params): Promise<void> => {
  if (collection === undefined) {
    return;
  }

  try {
    await collection.insertOne({
      ...location,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    if (typeof err === 'string') {
      console.log(`Error occured for location ${location.locationId}: ${err}`);
    }
  }
};

export { addLocation, getLocationCollection };
