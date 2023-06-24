import "dotenv/config";
import { MongoClient, ServerApiVersion } from "mongodb";

const { DB_URI, DB_NAME, COLLECTION_NAME } = process.env ?? {};

const client = new MongoClient(String(DB_URI), {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

type LocationSchema = {
  collection: any;
  locationId: string;
  availableTime: string | null;
  isAppointmentAvailable: boolean;
};
export async function addLocation({
  collection,
  locationId,
  availableTime,
  isAppointmentAvailable,
}: LocationSchema) {
  try {
    await collection.insertOne({
      locationId,
      availableTime,
      isAppointmentAvailable,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.log(`Error occured for location ${locationId}: ${err}`);
  }
}
