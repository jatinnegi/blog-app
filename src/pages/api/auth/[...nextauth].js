import { MongoClient } from "mongodb";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { verifyPassword } from "../../../../lib/helpers";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.mmt7s.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`;
        let client;
        client = await MongoClient.connect(connectionString);

        const usersCollection = client.db().collection("users");

        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          client.close();
          throw new Error("Invalid credentials");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error("Invalid credentials");
        }

        return {
          email: user.email,
        };
      },
    }),
  ],
});
