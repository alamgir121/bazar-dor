import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient((process.env.MONGODB_URL || process.env.MONGODB_URI || "mongodb://localhost:27017").trim());
const db = client.db(process.env.MONGODB_DB || "bazardor");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  baseURL: process.env.BETTER_AUTH_URL?.trim(),
  secret: process.env.BETTER_AUTH_SECRET?.trim(),
  emailAndPassword: { enabled: true, autoSignIn: false, minPasswordLength: 8 },
  socialProviders: {
    google: { clientId: process.env.GOOGLE_CLIENT_ID || "", clientSecret: process.env.GOOGLE_CLIENT_SECRET || "" },
    github: { clientId: process.env.GITHUB_CLIENT_ID || "", clientSecret: process.env.GITHUB_CLIENT_SECRET || "" },
  },
});


