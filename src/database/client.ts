import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

const { DB_URI } = process.env ?? {};

const client: MongoClient = new MongoClient(String(DB_URI), {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export default client;
