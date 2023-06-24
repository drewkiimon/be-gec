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

export { getCollection };
