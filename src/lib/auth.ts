import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const MONGO_URI =
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017";

// Singleton client to avoid opening multiple connections in dev HMR cycles
const globalForMongo = global as typeof globalThis & { _baMongoClient?: MongoClient };
if (!globalForMongo._baMongoClient) {
  globalForMongo._baMongoClient = new MongoClient(MONGO_URI);
}
const mongoClient = globalForMongo._baMongoClient;

const db = mongoClient.db("next-mart");

export const auth = betterAuth({
  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  user: {
    additionalFields: {
      image: {
        type: "string",
        defaultValue: "",
        required: false,
        input: true,
      },
    },
  },

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});
