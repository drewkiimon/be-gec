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
  locationId: string;
  availableTime: string | null;
  isAppointmentAvailable: boolean;
};
export async function addLocation({
  locationId,
  availableTime,
  isAppointmentAvailable,
}: LocationSchema) {
  try {
    await client.connect();
    const database = client.db(String(DB_NAME));
    const collection = database.collection(String(COLLECTION_NAME));

    await collection.insertOne({
      locationId,
      availableTime,
      isAppointmentAvailable,
      timestamp: new Date().toISOString(),
    });
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}
