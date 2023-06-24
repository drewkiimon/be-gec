import "dotenv/config";
import { MongoClient, ServerApiVersion } from "mongodb";

import type { Collection, Document } from "mongodb";

const { DB_URI, DB_NAME, COLLECTION_NAME } = process.env ?? {};

const client = new MongoClient(String(DB_URI), {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const getLocationCollection = (): Collection<Document> | undefined => {
  try {
    const database = client.db(String(DB_NAME));
    const collection = database.collection(String(COLLECTION_NAME));
    console.log("Connected to database and collection");
    return collection;
  } catch (err) {
    console.log("Error when connecting to collection");
    client.close();
  }
};

type LocationSchema = {
  locationId: string;
  availableTime: string | null;
  isAppointmentAvailable: boolean;
};
type Params = {
  collection: Collection<Document> | undefined;
  location: LocationSchema;
};
const addLocation = async ({ collection, location }: Params) => {
  if (!collection) {
    return;
  }
  try {
    await collection.insertOne({
      ...location,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.log(`Error occured for location ${location.locationId}: ${err}`);
  }
};

export { addLocation, getLocationCollection };
